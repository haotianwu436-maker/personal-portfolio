#!/bin/bash

# Personal Portfolio 部署脚本
# 用法: ./scripts/deploy.sh

set -e

echo "🚀 开始部署流程..."
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 步骤1: 检查依赖
echo -e "${YELLOW}[1/5]${NC} 检查依赖..."
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}❌ pnpm未安装${NC}"
    exit 1
fi
echo -e "${GREEN}✅ pnpm已安装${NC}"
echo ""

# 步骤2: 运行测试
echo -e "${YELLOW}[2/5]${NC} 运行单元测试..."
if pnpm test; then
    echo -e "${GREEN}✅ 所有测试通过${NC}"
else
    echo -e "${RED}❌ 测试失败，请修复问题后重试${NC}"
    exit 1
fi
echo ""

# 步骤3: TypeScript检查
echo -e "${YELLOW}[3/5]${NC} 检查TypeScript..."
if pnpm check; then
    echo -e "${GREEN}✅ TypeScript检查通过${NC}"
else
    echo -e "${RED}❌ TypeScript检查失败${NC}"
    exit 1
fi
echo ""

# 步骤4: 构建项目
echo -e "${YELLOW}[4/5]${NC} 构建项目..."
if pnpm build; then
    echo -e "${GREEN}✅ 项目构建成功${NC}"
else
    echo -e "${RED}❌ 项目构建失败${NC}"
    exit 1
fi
echo ""

# 步骤5: 提交到Git
echo -e "${YELLOW}[5/5]${NC} 提交到Git..."

# 检查是否有未提交的更改
if git diff --quiet && git diff --cached --quiet; then
    echo -e "${YELLOW}⚠️  没有未提交的更改${NC}"
else
    read -p "输入commit message: " commit_msg
    
    if [ -z "$commit_msg" ]; then
        echo -e "${RED}❌ Commit message不能为空${NC}"
        exit 1
    fi
    
    git add .
    git commit -m "$commit_msg"
    
    if git push github main; then
        echo -e "${GREEN}✅ 代码已推送到GitHub${NC}"
    else
        echo -e "${RED}❌ 推送到GitHub失败${NC}"
        exit 1
    fi
fi

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ 部署前检查完成！${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo ""
echo "📝 后续步骤："
echo "1. 访问 https://manus.space"
echo "2. 进入 personal-portfolio 项目"
echo "3. 点击 Publish 按钮发布最新版本"
echo ""
echo "🌐 网站地址: https://persfolio-iet8jqpk.manus.space/"
echo ""
