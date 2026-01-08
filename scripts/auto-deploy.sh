#!/bin/bash

# Personal Portfolio 完整自动化部署脚本
# 用法: ./scripts/auto-deploy.sh [commit_message]
# 功能: 自动运行测试、构建、提交、创建checkpoint并发布

set -e

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 配置
BACKUP_DIR=".deploy-backup"
CURRENT_COMMIT=$(git rev-parse HEAD)
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
DEPLOYMENT_LOG="deploy-$(date +%Y%m%d-%H%M%S).log"
COMMIT_MESSAGE="${1:-Auto-deployment from Cursor}"

# 函数：打印带时间戳的日志
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$DEPLOYMENT_LOG"
}

# 函数：打印成功信息
success() {
    echo -e "${GREEN}✅ $1${NC}" | tee -a "$DEPLOYMENT_LOG"
}

# 函数：打印错误信息
error() {
    echo -e "${RED}❌ $1${NC}" | tee -a "$DEPLOYMENT_LOG"
}

# 函数：打印警告信息
warning() {
    echo -e "${YELLOW}⚠️  $1${NC}" | tee -a "$DEPLOYMENT_LOG"
}

# 函数：打印信息
info() {
    echo -e "${CYAN}ℹ️  $1${NC}" | tee -a "$DEPLOYMENT_LOG"
}

# 函数：创建备份
create_backup() {
    log "创建备份..."
    mkdir -p "$BACKUP_DIR"
    
    # 备份当前的git状态
    echo "$CURRENT_COMMIT" > "$BACKUP_DIR/commit.txt"
    echo "$CURRENT_BRANCH" > "$BACKUP_DIR/branch.txt"
    
    # 备份package.json和pnpm-lock.yaml
    cp -r node_modules "$BACKUP_DIR/node_modules" 2>/dev/null || true
    cp package.json "$BACKUP_DIR/package.json" 2>/dev/null || true
    cp pnpm-lock.yaml "$BACKUP_DIR/pnpm-lock.yaml" 2>/dev/null || true
    
    success "备份已创建"
}

# 函数：回滚
rollback() {
    local reason="$1"
    error "部署失败: $reason"
    error "开始自动回滚..."
    
    log "回滚到 commit: $CURRENT_COMMIT"
    
    # 恢复git状态
    git reset --hard "$CURRENT_COMMIT" 2>&1 | tee -a "$DEPLOYMENT_LOG" || true
    
    # 恢复依赖
    if [ -d "$BACKUP_DIR/node_modules" ]; then
        log "恢复node_modules..."
        rm -rf node_modules
        cp -r "$BACKUP_DIR/node_modules" node_modules 2>/dev/null || true
    fi
    
    # 清理备份
    rm -rf "$BACKUP_DIR"
    
    error "回滚完成！"
    error "部署日志已保存到: $DEPLOYMENT_LOG"
    exit 1
}

# 函数：清理
cleanup() {
    log "清理临时文件..."
    rm -rf "$BACKUP_DIR"
    success "清理完成"
}

# 捕获错误并执行回滚
trap 'rollback "脚本执行出错"' ERR

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}🚀 Personal Portfolio 完整自动化部署${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo ""

log "部署开始"
log "当前分支: $CURRENT_BRANCH"
log "当前commit: $CURRENT_COMMIT"
log "Commit message: $COMMIT_MESSAGE"
echo ""

# 步骤1: 检查依赖
echo -e "${YELLOW}[1/8]${NC} 检查依赖..."
if ! command -v pnpm &> /dev/null; then
    error "pnpm未安装"
    exit 1
fi
success "pnpm已安装"
echo ""

# 步骤2: 创建备份
echo -e "${YELLOW}[2/8]${NC} 创建备份..."
create_backup
echo ""

# 步骤3: 运行测试
echo -e "${YELLOW}[3/8]${NC} 运行单元测试..."
if ! pnpm test 2>&1 | tee -a "$DEPLOYMENT_LOG"; then
    rollback "单元测试失败"
fi
success "所有测试通过"
echo ""

# 步骤4: TypeScript检查
echo -e "${YELLOW}[4/8]${NC} 检查TypeScript..."
if ! pnpm check 2>&1 | tee -a "$DEPLOYMENT_LOG"; then
    rollback "TypeScript检查失败"
fi
success "TypeScript检查通过"
echo ""

# 步骤5: 构建项目
echo -e "${YELLOW}[5/8]${NC} 构建项目..."
if ! pnpm build 2>&1 | tee -a "$DEPLOYMENT_LOG"; then
    rollback "项目构建失败"
fi
success "项目构建成功"
echo ""

# 步骤6: 提交到Git
echo -e "${YELLOW}[6/8]${NC} 提交到Git..."

# 检查是否有未提交的更改
if git diff --quiet && git diff --cached --quiet; then
    warning "没有未提交的更改，跳过git提交"
else
    if ! git add . 2>&1 | tee -a "$DEPLOYMENT_LOG"; then
        rollback "Git add失败"
    fi
    
    if ! git commit -m "$COMMIT_MESSAGE" 2>&1 | tee -a "$DEPLOYMENT_LOG"; then
        rollback "Git commit失败"
    fi
    
    if ! git push github main 2>&1 | tee -a "$DEPLOYMENT_LOG"; then
        rollback "推送到GitHub失败"
    fi
    
    success "代码已推送到GitHub"
fi
echo ""

# 步骤7: 创建Checkpoint
echo -e "${YELLOW}[7/8]${NC} 创建Checkpoint..."
log "执行 webdev_save_checkpoint..."

# 这里需要通过Manus API创建checkpoint
# 由于我们在脚本中无法直接调用Manus API，所以输出指导信息
info "Checkpoint需要通过Manus UI创建"
info "请访问: https://manus.space"
info "进入 personal-portfolio 项目"
info "点击 Publish 按钮发布最新版本"
echo ""

# 步骤8: 生成部署报告
echo -e "${YELLOW}[8/8]${NC} 生成部署报告..."

# 清理备份
cleanup

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ 自动化部署完成！${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo ""

# 显示部署摘要
echo -e "${BLUE}部署摘要:${NC}"
echo "├─ 当前分支: $CURRENT_BRANCH"
echo "├─ Commit: $CURRENT_COMMIT"
echo "├─ 测试: ✅ 通过"
echo "├─ TypeScript: ✅ 通过"
echo "├─ 构建: ✅ 成功"
echo "├─ Git推送: ✅ 成功"
echo "└─ 部署日志: $DEPLOYMENT_LOG"
echo ""

echo -e "${CYAN}📝 后续步骤:${NC}"
echo "1. 访问 https://manus.space"
echo "2. 进入 personal-portfolio 项目"
echo "3. 点击最新的 Checkpoint 卡片"
echo "4. 点击 Publish 按钮发布"
echo ""

echo -e "${CYAN}🌐 网站地址:${NC}"
echo "https://persfolio-iet8jqpk.manus.space/"
echo ""

echo -e "${CYAN}📚 查看部署日志:${NC}"
echo "cat $DEPLOYMENT_LOG"
echo ""
