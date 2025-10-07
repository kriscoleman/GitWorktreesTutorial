# Exercise 5: Cleanup and Maintenance

Effective worktree management includes knowing when and how to clean up. This final exercise teaches you best practices for maintaining a clean, efficient worktree environment and avoiding common pitfalls.

## 🎯 Learning Objectives

By the end of this exercise, you'll be able to:

- Identify when worktrees should be cleaned up
- Remove worktrees safely without losing work
- Handle orphaned worktrees and stale references
- Implement automated cleanup strategies
- Maintain an optimal development environment

## 📚 Why Cleanup Matters

### Problems with Poor Worktree Hygiene

- **Disk Space**: Abandoned worktrees consume significant storage
- **Mental Overhead**: Too many worktrees create decision paralysis
- **Performance**: Git operations slow down with many worktrees
- **Confusion**: Stale branches and directories mislead team members
- **Security**: Old worktrees may contain sensitive data

### Benefits of Regular Cleanup

- **Clean Workspace**: Easy to find and focus on active work
- **Better Performance**: Faster Git operations
- **Team Clarity**: Clear understanding of active development streams
- **Resource Efficiency**: Optimal use of disk space and memory

## 🛠️ Setup: Create a Messy Environment

Let's simulate a realistic development environment that needs cleanup:

```bash
cd /path/to/GitWorktreesTutorial

# Create various worktrees representing different stages of work
git worktree add ../tut-feature-old
git worktree add ../tut-experiment
git worktree add ../tut-hotfix-done
git worktree add ../tut-abandoned
git worktree add ../tut-review -b review-branch main

# Add some work to these worktrees
cd ../tut-feature-old
echo "# Old Feature - COMPLETED
This feature was completed and merged weeks ago." > old-feature.md
git add old-feature.md
git commit -m "feat: old feature implementation (DONE)"

cd ../tut-experiment  
echo "# Experimental API - FAILED
This experiment didn't work out." > experiment.md
git add experiment.md
git commit -m "experiment: new API approach (FAILED)"

cd ../tut-hotfix-done
echo "# Emergency Fix - DEPLOYED
This hotfix was deployed to production." > emergency-fix.md
git add emergency-fix.md
git commit -m "hotfix: emergency production fix (DEPLOYED)"

cd ../tut-abandoned
echo "# Abandoned Work - CANCELLED
This feature was cancelled due to changing requirements." > abandoned.md
git add abandoned.md
git commit -m "wip: abandoned feature work (CANCELLED)"

# Return to main directory
cd ../GitWorktreesTutorial
```

## 📝 Exercise Steps

### Step 1: Assess Your Worktree Situation

First, understand what you're working with:

```bash
# List all worktrees
git worktree list

# Check all branches
git branch -a

# See disk usage
du -sh ../*GitWorktreesTutorial*

# List directories
ls -la ../
```

You should see something like:

```
GitWorktreesTutorial/           # Main worktree
tut-feature-old/
tut-experiment/
tut-hotfix-done/
tut-abandoned/
tut-review/
```

### Step 2: Categorize Worktrees for Cleanup

Create a cleanup strategy by categorizing your worktrees:

```bash
echo "# Worktree Cleanup Assessment

## Categories for Cleanup

### ✅ Safe to Remove (Completed/Deployed)
- tut-feature-old (feature merged)
- tut-hotfix-done (hotfix deployed)

### ❌ Remove (Failed/Abandoned)  
- tut-experiment (failed experiment)
- tut-abandoned (cancelled feature)

### 🤔 Keep (Active/Useful)
- tut-review (ongoing code review)
- GitWorktreesTutorial (main development)

## Cleanup Plan
1. Archive important work from abandoned features
2. Remove completed/deployed worktrees
3. Remove failed/abandoned worktrees
4. Clean up associated branches
5. Verify clean state
" > cleanup-plan.md

git add cleanup-plan.md
git commit -m "docs: create worktree cleanup assessment and plan"
```

### Step 3: Archive Important Work (Optional)

Before removing abandoned work, consider archiving anything valuable:

```bash
# Create archive branch for abandoned work (if needed)
cd ../tut-abandoned
git checkout -b archive/abandoned-feature-$(date +%Y%m%d)
git push origin archive/abandoned-feature-$(date +%Y%m%d)

echo "Archived abandoned work to archive/abandoned-feature-$(date +%Y%m%d)" >> ../GitWorktreesTutorial/cleanup-plan.md

cd ../GitWorktreesTutorial
```

### Step 4: Remove Completed Worktrees

Clean up worktrees for completed work:

```bash
# Remove completed feature worktree
git worktree remove ../tut-feature-old

# Remove deployed hotfix worktree  
git worktree remove ../tut-hotfix-done

# Verify removal
git worktree list
ls -la ../
```

### Step 5: Handle Failed/Abandoned Worktrees

Remove worktrees for work that didn't pan out:

```bash
# Remove experimental worktree
git worktree remove ../tut-experiment

# Remove abandoned worktree
git worktree remove ../tut-abandoned

# Verify cleanup
git worktree list
```

### Step 6: Clean Up Associated Branches

Remove branches that are no longer needed:

```bash
# List all branches to review
git branch -a

# Remove local branches for cleaned up worktrees
git branch -d tut-feature-old
git branch -d tut-hotfix-done
git branch -d tut-experiment
git branch -d tut-abandoned

# Check remaining branches
git branch -a
```

### Step 7: Handle Orphaned References

Sometimes worktree directories get deleted manually, leaving orphaned references:

```bash
# Simulate an orphaned worktree (don't do this normally!)
rm -rf ../tut-review

# Try to list worktrees - you'll see a problem
git worktree list

# Clean up orphaned references
git worktree prune

# Verify clean state
git worktree list
```

### Step 8: Create Cleanup Automation

Create a script to help with future cleanup:

```bash
mkdir -p scripts
echo '#!/bin/bash

# Git Worktree Cleanup Script

echo "🧹 Git Worktree Cleanup Tool"
echo "=============================="
echo

# Show current worktrees
echo "📋 Current Worktrees:"
git worktree list
echo

# Show disk usage
echo "💾 Disk Usage:"
du -sh ../*$(basename $(pwd))* 2>/dev/null | sort -hr
echo

# Prompt for cleanup
echo "🤔 Cleanup Options:"
echo "1. List branches by last activity"
echo "2. Remove orphaned worktree references"  
echo "3. Show worktrees older than 30 days"
echo "4. Interactive cleanup mode"
echo "5. Exit"
echo

read -p "Choose an option (1-5): " choice

case $choice in
  1)
    echo "📅 Branches by last activity:"
    git for-each-ref --sort=-committerdate refs/heads/ --format="%(committerdate:short) %(refname:short)"
    ;;
  2)
    echo "🧹 Removing orphaned references..."
    git worktree prune
    echo "✅ Cleanup complete!"
    ;;
  3)
    echo "⏰ Worktrees older than 30 days:"
    find .. -maxdepth 1 -name "*$(basename $(pwd))*" -type d -mtime +30 2>/dev/null
    ;;
  4)
    echo "🎯 Interactive cleanup mode:"
    git worktree list | while read line; do
      path=$(echo "$line" | awk "{print \$1}")
      if [ "$path" != "$(pwd)" ]; then
        echo "Worktree: $line"
        read -p "Remove this worktree? (y/N): " confirm
        if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
          git worktree remove "$path" 2>/dev/null && echo "✅ Removed $path"
        fi
      fi
    done
    ;;
  5)
    echo "👋 Goodbye!"
    exit 0
    ;;
  *)
    echo "❌ Invalid option"
    ;;
esac
' > scripts/cleanup-worktrees.sh

chmod +x scripts/cleanup-worktrees.sh

git add scripts/cleanup-worktrees.sh
git commit -m "feat: add automated worktree cleanup script"
```

### Step 9: Test the Cleanup Script

```bash
# Test your cleanup script
./scripts/cleanup-worktrees.sh

# Choose option 2 to prune any remaining orphaned references
```

### Step 10: Document Cleanup Best Practices

```bash
echo "# Worktree Cleanup Best Practices

## When to Clean Up Worktrees

### ✅ Immediate Cleanup
- Feature branches merged to main
- Hotfixes deployed to production
- Experiments that failed/concluded
- Cancelled or abandoned features

### 🤔 Consider Keeping
- Active feature development
- Code review environments
- Long-running maintenance branches
- Backup/archive purposes

## Cleanup Frequency

### Daily
- Remove merged feature worktrees
- Clean up failed experiments

### Weekly  
- Review all active worktrees
- Archive abandoned work if valuable
- Run \`git worktree prune\`

### Monthly
- Deep cleanup of old branches
- Review disk usage
- Update cleanup scripts

## Cleanup Commands Reference

\`\`\`bash
# List all worktrees
git worktree list

# Remove specific worktree  
git worktree remove <path>

# Clean orphaned references
git worktree prune

# Remove associated branch
git branch -d <branch-name>

# Force remove (if needed)
git worktree remove --force <path>
git branch -D <branch-name>
\`\`\`

## Automation Ideas

### Git Hooks
- pre-push: Remind about cleanup
- post-merge: Auto-remove merged feature worktrees

### Cron Jobs
- Daily: Run \`git worktree prune\`
- Weekly: Generate cleanup reports

### IDE Integration
- VSCode: Extension to show worktree status
- Shell: Aliases for common cleanup tasks

## Team Guidelines

### Naming Conventions
- Use consistent prefixes: \`project-feature-name\`
- Include dates for experiments: \`project-experiment-20241201\`
- Mark status: \`project-hotfix-deployed\`

### Communication
- Slack/notify when removing shared worktrees
- Document cleanup in commit messages
- Share cleanup scripts with team

## Red Flags 🚩

### When NOT to Clean Up
- Worktree has uncommitted changes
- Feature branch not fully tested
- Hotfix not confirmed deployed
- Team member still working in worktree

### Emergency Recovery
- Check Git reflog: \`git reflog\`
- Look for lost commits: \`git fsck --lost-found\`
- Restore from backups if available
" > docs/CLEANUP_GUIDE.md

mkdir -p docs
git add docs/CLEANUP_GUIDE.md
git commit -m "docs: comprehensive worktree cleanup guide"
```

## ✅ Validation

Test your cleanup mastery:

```bash
../../scripts/validate-exercise.sh 05
```

Expected outcomes:

- Demonstrated ability to categorize and clean up worktrees
- Removed completed, failed, and abandoned worktrees safely
- Created automation tools for ongoing cleanup
- Documented best practices for team use

## 🎓 Key Takeaways

### The Importance of Hygiene

1. **Regular Cleanup**: Don't let worktrees accumulate indefinitely
2. **Strategic Removal**: Consider the value and status of each worktree
3. **Automation**: Use scripts to make cleanup effortless
4. **Team Coordination**: Communicate cleanup activities with your team

### Cleanup Decision Matrix

| Worktree Status | Action | Timeline |
|----------------|--------|----------|
| Feature merged | Remove immediately | Same day |
| Hotfix deployed | Remove after confirmation | 1-2 days |
| Experiment failed | Remove or archive | Same day |
| Feature cancelled | Archive then remove | 1 week |
| Review environment | Keep or refresh | Ongoing |
| Long-running feature | Keep | Until complete |

## 💡 Advanced Cleanup Strategies

### Automated Branch Cleanup

```bash
# Remove branches merged to main
git branch --merged main | grep -v "main\|master" | xargs -n 1 git branch -d

# Remove remote tracking branches
git remote prune origin
```

### Disk Space Monitoring

```bash
# Monitor worktree disk usage
alias worktree-usage="du -sh ../*$(basename $(pwd))* | sort -hr"

# Alert when total usage exceeds threshold
if [ $(du -s ../*$(basename $(pwd))* | awk '{sum+=$1} END {print sum}') -gt 1000000 ]; then
  echo "⚠️  Worktree usage high - consider cleanup"
fi
```

### Backup Before Cleanup

```bash
# Create backup before major cleanup
git bundle create backup-$(date +%Y%m%d).bundle --all
```

## 🚀 Conclusion

Congratulations! You've completed the Git Worktrees Tutorial and mastered:

1. **Basic Operations** - Creating, listing, and removing worktrees
2. **Parallel Development** - Working on multiple features simultaneously  
3. **Emergency Response** - Handling hotfixes without context loss
4. **AI Integration** - Coordinating multiple AI agents with worktrees
5. **Maintenance** - Keeping your environment clean and efficient

### Your New Superpowers 🦸‍♂️

- **Zero Context Switching**: Work on multiple tasks without mental overhead
- **Emergency Ready**: Handle production issues instantly while preserving work
- **AI Multiplier**: Leverage multiple AI agents for parallel development
- **Team Efficiency**: Coordinate complex development streams effectively
- **Professional Hygiene**: Maintain clean, efficient development environments

### Next Steps

- Apply worktrees to your real projects
- Share knowledge with your team
- Customize scripts for your workflow
- Explore advanced Git worktree features
- Contribute improvements to this tutorial

## 🎉 You're Now a Git Worktree Expert

Go forth and revolutionize your development workflow!

Share your success stories and improvements at [GitHub Issues](../../issues).

---

**Remember**: The best development tool is the one that gets out of your way and lets you focus on creating amazing software. Git worktrees do exactly that. 🌳✨
