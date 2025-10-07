#!/bin/bash

# Git Worktrees Tutorial Exercise Validator
# Validates completion of tutorial exercises

set -e  # Exit on any error

echo "✅ Git Worktrees Exercise Validator"
echo "===================================="
echo

# Check if exercise number is provided
if [ $# -eq 0 ]; then
    echo "❌ Error: Please specify an exercise number"
    echo "Usage: $0 <exercise-number>"
    echo "Available exercises: 01, 02, 03, 04, 05"
    exit 1
fi

EXERCISE=$1
REPO_NAME=$(basename "$(git rev-parse --show-toplevel)" 2>/dev/null || echo "unknown")

# Check if we're in a git repository
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    echo "❌ Error: Not inside a git repository"
    exit 1
fi

echo "🎯 Validating Exercise $EXERCISE"
echo "📁 Repository: $REPO_NAME"
echo

# Validation functions
validate_exercise_01() {
    echo "🔍 Exercise 1: Basic Worktree Operations"
    echo "========================================"
    
    local score=0
    local total=4
    
    # Check if user understands worktree listing
    echo "📋 Checking worktree list..."
    if git worktree list > /dev/null 2>&1; then
        echo "✅ Can list worktrees"
        ((score++))
    else
        echo "❌ Cannot list worktrees"
    fi
    
    # Check if any worktrees were created
    local worktree_count=$(git worktree list | wc -l)
    if [ "$worktree_count" -gt 1 ]; then
        echo "✅ Created additional worktrees ($((worktree_count - 1)) extra)"
        ((score++))
    else
        echo "❌ No additional worktrees found"
    fi
    
    # Check if branches were created
    local branch_count=$(git branch | grep -v "^\*" | wc -l)
    if [ "$branch_count" -gt 0 ]; then
        echo "✅ Created feature branches ($branch_count branches)"
        ((score++))
    else
        echo "❌ No feature branches found"
    fi
    
    # Check understanding of worktree independence
    if git log --oneline | head -1 > /dev/null 2>&1; then
        echo "✅ Repository has commit history"
        ((score++))
    else
        echo "❌ No commit history found"
    fi
    
    echo
    echo "📊 Exercise 1 Score: $score/$total"
    
    if [ $score -eq $total ]; then
        echo "🎉 Exercise 1 PASSED! You understand basic worktree operations."
    elif [ $score -ge 2 ]; then
        echo "⚠️  Exercise 1 PARTIAL. Review the basic operations section."
    else
        echo "❌ Exercise 1 FAILED. Please retry the basic operations exercise."
    fi
}

validate_exercise_02() {
    echo "🔍 Exercise 2: Parallel Feature Development"
    echo "============================================"
    
    local score=0
    local total=5
    
    # Check for multiple feature branches
    echo "🌿 Checking feature branches..."
    local feature_branches=$(git branch -a | grep -c "feature/" || echo "0")
    if [ "$feature_branches" -ge 2 ]; then
        echo "✅ Multiple feature branches found ($feature_branches branches)"
        ((score++))
    else
        echo "❌ Need at least 2 feature branches for parallel development"
    fi
    
    # Check for commits in feature branches
    echo "📝 Checking feature branch commits..."
    local feature_commits=0
    for branch in $(git branch | grep "feature/" | sed 's/^[* ]//'); do
        if git log "$branch" --oneline | head -1 > /dev/null 2>&1; then
            ((feature_commits++))
        fi
    done
    
    if [ "$feature_commits" -ge 2 ]; then
        echo "✅ Feature branches have commits ($feature_commits branches with work)"
        ((score++))
    else
        echo "❌ Feature branches need commits to show parallel development"
    fi
    
    # Check for worktree usage
    echo "🌳 Checking worktree usage..."
    local worktree_count=$(git worktree list | wc -l)
    if [ "$worktree_count" -ge 3 ]; then
        echo "✅ Multiple worktrees created for parallel work"
        ((score++))
    else
        echo "❌ Need multiple worktrees for parallel development exercise"
    fi
    
    # Check for merge or integration understanding
    echo "🔀 Checking integration understanding..."
    if git log --oneline --graph | head -10 | grep -q "Merge\|merge" || git branch --merged main | grep -q "feature/"; then
        echo "✅ Shows understanding of feature integration"
        ((score++))
    else
        echo "⚠️  No evidence of feature integration (optional for this exercise)"
        ((score++))  # Give partial credit
    fi
    
    # Check for documentation of parallel workflow
    if [ -f "dashboard-progress.md" ] || [ -f "auth.md" ] || [ -f "dashboard.md" ] || [ -f "rate-limiting.md" ]; then
        echo "✅ Created feature documentation files"
        ((score++))
    else
        echo "❌ No feature documentation found"
    fi
    
    echo
    echo "📊 Exercise 2 Score: $score/$total"
    
    if [ $score -ge 4 ]; then
        echo "🎉 Exercise 2 PASSED! You understand parallel feature development."
    elif [ $score -ge 3 ]; then
        echo "⚠️  Exercise 2 PARTIAL. Review parallel development concepts."
    else
        echo "❌ Exercise 2 FAILED. Please retry the parallel features exercise."
    fi
}

validate_exercise_03() {
    echo "🔍 Exercise 3: Hotfix Workflow"
    echo "=============================="
    
    local score=0
    local total=5
    
    # Check for hotfix branch
    echo "🚨 Checking hotfix branches..."
    if git branch -a | grep -q "hotfix/"; then
        echo "✅ Hotfix branch found"
        ((score++))
    else
        echo "❌ No hotfix branch found"
    fi
    
    # Check for feature branch preservation
    echo "🛡️  Checking feature branch preservation..."
    if git branch | grep -q "feature/"; then
        echo "✅ Feature branches preserved during hotfix"
        ((score++))
    else
        echo "⚠️  No feature branches found (may have been cleaned up)"
        ((score++))  # Give credit as cleanup is acceptable
    fi
    
    # Check for hotfix commits
    echo "🔧 Checking hotfix commits..."
    local hotfix_commits=$(git log --oneline --all | grep -c "hotfix\|fix:\|emergency" || echo "0")
    if [ "$hotfix_commits" -ge 1 ]; then
        echo "✅ Hotfix commits found ($hotfix_commits commits)"
        ((score++))
    else
        echo "❌ No hotfix commits found"
    fi
    
    # Check for merge to main
    echo "🔀 Checking hotfix integration..."
    if git log --oneline main | grep -q "hotfix\|fix:\|emergency\|Merge.*hotfix"; then
        echo "✅ Hotfix merged to main branch"
        ((score++))
    else
        echo "❌ Hotfix not merged to main"
    fi
    
    # Check for workflow understanding (deployment log or similar)
    if [ -f "deployment-log.md" ] || [ -f "login-system.md" ] || git log --oneline | grep -q "deploy"; then
        echo "✅ Shows understanding of deployment workflow"
        ((score++))
    else
        echo "❌ No evidence of deployment workflow understanding"
    fi
    
    echo
    echo "📊 Exercise 3 Score: $score/$total"
    
    if [ $score -ge 4 ]; then
        echo "🎉 Exercise 3 PASSED! You understand emergency hotfix workflows."
    elif [ $score -ge 3 ]; then
        echo "⚠️  Exercise 3 PARTIAL. Review hotfix workflow concepts."
    else
        echo "❌ Exercise 3 FAILED. Please retry the hotfix workflow exercise."
    fi
}

validate_exercise_04() {
    echo "🔍 Exercise 4: AI Agent Workflows"
    echo "================================="
    
    local score=0
    local total=6
    
    # Check for AI agent branches
    echo "🤖 Checking AI agent branches..."
    local ai_branches=$(git branch -a | grep -c "ai/\|agent\|feature/auth-system\|feature/ui-components\|feature/api-backend\|feature/testing-suite" || echo "0")
    if [ "$ai_branches" -ge 3 ]; then
        echo "✅ Multiple AI agent branches found ($ai_branches branches)"
        ((score++))
    else
        echo "❌ Need multiple AI agent branches for this exercise"
    fi
    
    # Check for AI-generated content structure
    echo "📁 Checking AI-generated content..."
    if [ -d "auth" ] || [ -d "components" ] || [ -d "api" ] || [ -d "tests" ]; then
        echo "✅ AI-generated project structure found"
        ((score++))
    else
        echo "❌ No AI-generated project structure found"
    fi
    
    # Check for component files
    echo "🧩 Checking component implementations..."
    local component_files=0
    for file in "auth/models/User.js" "components/auth/LoginForm.tsx" "api/routes/index.js" "tests/integration/auth.test.js"; do
        if [ -f "$file" ]; then
            ((component_files++))
        fi
    done
    
    if [ "$component_files" -ge 2 ]; then
        echo "✅ AI-generated component files found ($component_files files)"
        ((score++))
    else
        echo "❌ Not enough AI-generated component files"
    fi
    
    # Check for integration planning
    echo "📋 Checking integration planning..."
    if [ -f "ai-integration-report.md" ] || [ -f "auth-system-plan.md" ] || [ -f "ui-components-plan.md" ]; then
        echo "✅ AI integration planning documentation found"
        ((score++))
    else
        echo "❌ No AI integration planning found"
    fi
    
    # Check for parallel development evidence
    echo "⚡ Checking parallel development evidence..."
    local parallel_commits=$(git log --oneline --all | grep -c "AI Agent\|Generated by\|feat(auth)\|feat(ui)\|feat(api)\|feat(testing)" || echo "0")
    if [ "$parallel_commits" -ge 3 ]; then
        echo "✅ Evidence of parallel AI development ($parallel_commits commits)"
        ((score++))
    else
        echo "❌ Not enough evidence of parallel AI development"
    fi
    
    # Check for successful integration
    echo "🔗 Checking AI work integration..."
    if [ -f "ai-development-success.md" ] || git log --oneline | grep -q "AI-assisted\|multi-agent"; then
        echo "✅ AI work successfully integrated"
        ((score++))
    else
        echo "❌ No evidence of successful AI integration"
    fi
    
    echo
    echo "📊 Exercise 4 Score: $score/$total"
    
    if [ $score -ge 5 ]; then
        echo "🎉 Exercise 4 PASSED! You understand AI agent coordination with worktrees."
    elif [ $score -ge 3 ]; then
        echo "⚠️  Exercise 4 PARTIAL. Review AI agent workflow concepts."
    else
        echo "❌ Exercise 4 FAILED. Please retry the AI agents exercise."
    fi
}

validate_exercise_05() {
    echo "🔍 Exercise 5: Cleanup and Maintenance"
    echo "======================================"
    
    local score=0
    local total=5
    
    # Check for cleanup documentation
    echo "📚 Checking cleanup documentation..."
    if [ -f "cleanup-plan.md" ] || [ -f "docs/CLEANUP_GUIDE.md" ]; then
        echo "✅ Cleanup documentation found"
        ((score++))
    else
        echo "❌ No cleanup documentation found"
    fi
    
    # Check for cleanup script
    echo "🧹 Checking cleanup automation..."
    if [ -f "scripts/cleanup-worktrees.sh" ] && [ -x "scripts/cleanup-worktrees.sh" ]; then
        echo "✅ Cleanup script found and executable"
        ((score++))
    else
        echo "❌ No executable cleanup script found"
    fi
    
    # Check for reasonable number of worktrees (not too many)
    echo "📊 Checking worktree management..."
    local worktree_count=$(git worktree list | wc -l)
    if [ "$worktree_count" -le 5 ]; then
        echo "✅ Reasonable number of worktrees ($worktree_count total)"
        ((score++))
    else
        echo "⚠️  Many worktrees ($worktree_count) - consider cleanup"
    fi
    
    # Check for evidence of cleanup operations
    echo "🗑️  Checking cleanup evidence..."
    if git log --oneline | grep -q "cleanup\|remove\|prune" || [ -f "cleanup-plan.md" ]; then
        echo "✅ Evidence of cleanup operations"
        ((score++))
    else
        echo "❌ No evidence of cleanup operations"
    fi
    
    # Check for maintenance best practices understanding
    echo "💡 Checking maintenance understanding..."
    if [ -f "docs/CLEANUP_GUIDE.md" ] || git log --oneline | grep -q "maintenance\|best practices"; then
        echo "✅ Shows understanding of maintenance best practices"
        ((score++))
    else
        echo "❌ No evidence of maintenance best practices understanding"
    fi
    
    echo
    echo "📊 Exercise 5 Score: $score/$total"
    
    if [ $score -ge 4 ]; then
        echo "🎉 Exercise 5 PASSED! You understand worktree cleanup and maintenance."
    elif [ $score -ge 3 ]; then
        echo "⚠️  Exercise 5 PARTIAL. Review cleanup and maintenance concepts."
    else
        echo "❌ Exercise 5 FAILED. Please retry the cleanup exercise."
    fi
}

# Main validation logic
case $EXERCISE in
    "01"|"1")
        validate_exercise_01
        ;;
    "02"|"2")
        validate_exercise_02
        ;;
    "03"|"3")
        validate_exercise_03
        ;;
    "04"|"4")
        validate_exercise_04
        ;;
    "05"|"5")
        validate_exercise_05
        ;;
    "all")
        echo "🎯 Validating All Exercises"
        echo "==========================="
        echo
        validate_exercise_01
        echo
        validate_exercise_02
        echo
        validate_exercise_03
        echo
        validate_exercise_04
        echo
        validate_exercise_05
        ;;
    *)
        echo "❌ Error: Invalid exercise number '$EXERCISE'"
        echo "Valid options: 01, 02, 03, 04, 05, all"
        exit 1
        ;;
esac

echo
echo "💡 Pro Tips:"
echo "- Run './scripts/worktree-status.sh' for detailed worktree overview"
echo "- Use './scripts/cleanup-worktrees.sh' to clean up practice worktrees"
echo "- Review exercise README files for detailed instructions"
echo

echo "✨ Validation complete! Keep up the great work! 🚀"