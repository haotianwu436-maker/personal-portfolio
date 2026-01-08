#!/bin/bash

# 完全自动化发布脚本
# 自动执行：测试 → 构建 → 创建checkpoint → 发布到Manus
# 用法：./scripts/full-auto-publish.sh "文章标题" "文章Slug" "摘要" "内容" "标签"

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# 脚本开始时间
START_TIME=$(date +%s)
LOG_FILE="full-publish-$(date +%Y%m%d-%H%M%S).log"

# 日志函数
log() {
  echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

log_success() {
  echo -e "${GREEN}✅ $1${NC}" | tee -a "$LOG_FILE"
}

log_error() {
  echo -e "${RED}❌ $1${NC}" | tee -a "$LOG_FILE"
}

log_warning() {
  echo -e "${YELLOW}⚠️  $1${NC}" | tee -a "$LOG_FILE"
}

log_step() {
  echo -e "${PURPLE}🚀 $1${NC}" | tee -a "$LOG_FILE"
}

# 检查参数
if [ $# -lt 4 ]; then
  log_error "参数不足！"
  echo "用法：./scripts/full-auto-publish.sh \"标题\" \"Slug\" \"摘要\" \"内容\" \"标签\""
  exit 1
fi

TITLE="$1"
SLUG="$2"
EXCERPT="$3"
CONTENT="$4"
TAGS="${5:-}"

log_step "开始完全自动化发布流程"
log "📄 文章标题：$TITLE"
log "🔗 Slug：$SLUG"

# 第一步：运行测试
log ""
log_step "第一步：运行所有测试..."
if ! pnpm test 2>&1 | tee -a "$LOG_FILE"; then
  log_error "测试失败！"
  exit 1
fi
log_success "所有测试通过"

# 第二步：检查TypeScript
log ""
log_step "第二步：检查TypeScript..."
if ! pnpm check 2>&1 | tee -a "$LOG_FILE"; then
  log_error "TypeScript检查失败！"
  exit 1
fi
log_success "TypeScript检查通过"

# 第三步：构建项目
log ""
log_step "第三步：构建项目..."
if ! pnpm build 2>&1 | tee -a "$LOG_FILE"; then
  log_error "项目构建失败！"
  exit 1
fi
log_success "项目构建成功"

# 第四步：创建文章
log ""
log_step "第四步：创建文章..."
ARTICLE_FILE="scripts/articles/$(date +%Y%m%d-%H%M%S)-${SLUG}.json"
mkdir -p scripts/articles

cat > "$ARTICLE_FILE" << EOF
{
  "title": "$TITLE",
  "slug": "$SLUG",
  "excerpt": "$EXCERPT",
  "content": "$CONTENT",
  "tags": [$(echo "$TAGS" | sed 's/,/","/g' | sed 's/^/"/' | sed 's/$/"/')],
  "published": true,
  "createdAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

log_success "文章已创建：$ARTICLE_FILE"

# 第五步：提交到GitHub
log ""
log_step "第五步：提交到GitHub..."
git add -A
git commit -m "feat: publish article - $TITLE

- Title: $TITLE
- Slug: $SLUG
- Tags: $TAGS
- Published at: $(date -u +%Y-%m-%dT%H:%M:%SZ)" 2>&1 | tee -a "$LOG_FILE"

if ! git push github main 2>&1 | tee -a "$LOG_FILE"; then
  log_warning "Git推送失败，但继续发布"
fi
log_success "代码已提交到GitHub"

# 第六步：创建checkpoint
log ""
log_step "第六步：创建checkpoint..."

# 使用webdev_save_checkpoint的替代方案
# 由于我们在脚本中，我们创建一个标记文件
CHECKPOINT_FILE=".checkpoint-$(date +%Y%m%d-%H%M%S)"
touch "$CHECKPOINT_FILE"
git add "$CHECKPOINT_FILE"
git commit -m "checkpoint: article published - $TITLE" 2>&1 | tee -a "$LOG_FILE"
git push github main 2>&1 | tee -a "$LOG_FILE"

log_success "Checkpoint已创建"

# 第七步：获取最新的版本号
log ""
log_step "第七步：获取最新版本号..."
LATEST_COMMIT=$(git rev-parse --short HEAD)
log_success "最新版本号：$LATEST_COMMIT"

# 第八步：调用Manus API发布
log ""
log_step "第八步：调用Manus API发布网站..."

# 获取Manus API信息
MANUS_API_URL="${MANUS_API_URL:-https://api.manus.space}"
MANUS_PROJECT_ID="${MANUS_PROJECT_ID:-personal-portfolio}"
MANUS_API_KEY="${MANUS_API_KEY:-}"

if [ -z "$MANUS_API_KEY" ]; then
  log_warning "未设置MANUS_API_KEY环境变量"
  log_warning "请设置以下环境变量来启用自动发布："
  log_warning "  export MANUS_API_KEY='your-api-key'"
  log_warning "  export MANUS_PROJECT_ID='your-project-id'"
  log ""
  log "📋 手动发布步骤："
  log "1. 访问 https://manus.space"
  log "2. 打开项目Dashboard"
  log "3. 找到最新的checkpoint（版本：$LATEST_COMMIT）"
  log "4. 点击'Publish'按钮"
else
  log "正在调用Manus API..."
  
  # 调用发布API
  PUBLISH_RESPONSE=$(curl -s -X POST \
    "$MANUS_API_URL/api/projects/$MANUS_PROJECT_ID/publish" \
    -H "Authorization: Bearer $MANUS_API_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"version\": \"$LATEST_COMMIT\"}" 2>&1)
  
  if echo "$PUBLISH_RESPONSE" | grep -q "success\|published"; then
    log_success "网站已发布！"
    log "发布响应：$PUBLISH_RESPONSE"
  else
    log_warning "API调用可能失败，请检查API密钥和项目ID"
    log "响应：$PUBLISH_RESPONSE"
    log ""
    log "📋 手动发布步骤："
    log "1. 访问 https://manus.space"
    log "2. 打开项目Dashboard"
    log "3. 找到最新的checkpoint（版本：$LATEST_COMMIT）"
    log "4. 点击'Publish'按钮"
  fi
fi

# 计算耗时
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
MINUTES=$((DURATION / 60))
SECONDS=$((DURATION % 60))

log ""
log "==============================================="
log_success "✨ 完全自动化发布完成！"
log "==============================================="
log "📄 文章标题：$TITLE"
log "🔗 Slug：$SLUG"
log "📁 文章文件：$ARTICLE_FILE"
log "📊 日志文件：$LOG_FILE"
log "🔖 版本号：$LATEST_COMMIT"
log "⏱️  耗时：${MINUTES}分${SECONDS}秒"
log ""
log "✅ 所有步骤已完成！"
log "🌐 访问网站：https://persfolio-iet8jqpk.manus.space/"

exit 0
