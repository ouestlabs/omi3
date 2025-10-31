---
description: Analyze recent git commits and changes to suggest blog posts, tweets, emails, changelog updates, press releases, and other marketing content based on what was shipped
---
 
# Content Marketing from Shipments
 
This rule helps generate content suggestions based on recent code changes, commits, and shipped features.
 
## Process
 
1. **Analyze Recent Changes**
   - Look at git log for the past week: `git log --since="1 week ago" --pretty=format:"%h - %s (%an, %ar)"`
   - Check merged PRs and their descriptions
   - Review modified files and their purpose
   - Identify new features, bug fixes, improvements, and refactors
 
2. **Categorize Changes by Impact**
   - **High Impact**: New features, major improvements, breaking changes
   - **Medium Impact**: Enhancements, notable bug fixes, performance improvements
   - **Low Impact**: Minor fixes, refactors, dependency updates
 
3. **Content Suggestions by Type**
 
### Blog Posts (High Impact Changes)
- Focus on features that solve user problems
- Include: problem statement, solution, benefits, screenshots/demos, code examples
- Tone: Educational, in-depth, SEO-optimized
- Length: 800-2000 words
- Examples:
  - "Introducing [Feature]: How We Built..."
  - "How [Feature] Helps You..."
  - "Behind the Scenes: Building [Feature]"
 
### Tweets/Social Media (All Impact Levels)
- **Launch tweets**: Announce features with benefits and visuals
- **Thread format**: Break down complex features into digestible tweets
- **Tip tweets**: Share quick wins and best practices
- **Behind-the-scenes**: Development process, decisions made
- Tone: Conversational, concise, engaging
- Include: Emojis, hashtags, mentions, links, visuals
- Pro tip: Treat every release like a launch event (rally early engagement)
 
### Changelog Updates (All Impact Levels)
- Structure: `## [Version] - [Date]`
- Categories: Added, Changed, Fixed, Deprecated, Removed, Security
- Format: Bullet points, user-facing language
- Link to docs/blog posts for major features
- Keep technical but accessible
 
### Email Updates (Medium to High Impact)
- **Newsletter**: Weekly/monthly roundup of changes
- **Feature announcements**: Dedicated email for major releases
- **Onboarding sequences**: Update with new features
- Structure: Hero image, brief intro, feature highlights, CTA
- Tone: Personal, benefit-focused, actionable
 
### Press Releases (High Impact Only)
- For: Major launches, milestones, partnerships, funding
- Structure: Headline, summary, quotes, boilerplate, contact
- Tone: Professional, newsworthy, quotable
- Distribution: Press release services, direct to journalists
 
### Documentation Updates (All Impact Levels)
- Update getting started guides
- Add new feature documentation
- Update API references
- Add code examples and use cases
- Update troubleshooting sections
 
### Video Content (High Impact)
- Demo videos for new features
- Tutorial walkthroughs
- Release overview videos
- Developer diaries/vlogs
 
## Content Strategy Tips
 
1. **Repurpose Content**: Blog post → Thread → Newsletter → Docs
2. **Time Releases**: Coordinate content across channels
3. **User Benefits First**: Focus on "what's in it for them"
4. **Show, Don't Tell**: Use screenshots, GIFs, videos
5. **SEO Optimization**: Use keywords, meta descriptions, alt text
6. **Call to Action**: Always include next steps
7. **Cross-link**: Connect related content pieces
8. **Collect Feedback**: Monitor engagement and iterate
 
## Output Format
 
When analyzing shipments, provide:
 
\`\`\`markdown
## Week of [Date Range]
 
### Summary
[High-level overview of what shipped]
 
### High Impact Changes
- [Change 1]: [Description]
- [Change 2]: [Description]
 
### Content Suggestions
 
#### Blog Posts
1. **"[Title]"** - [Brief description, key points, target audience]
2. **"[Title]"** - [Brief description, key points, target audience]
 
#### Tweets/Threads
1. 🎉 Launch tweet: [Draft tweet text with emojis]
2. 🧵 Thread idea: [Topic and key points]
3. 💡 Tip: [Quick value tweet]
 
#### Changelog Entry
\`\`\`
## [Version] - [Date]
 
### Added
- [Feature]: [User-facing description]
 
### Fixed
- [Bug]: [What was fixed]
\`\`\`
 
#### Email Subject Lines
- "[Compelling subject line option 1]"
- "[Compelling subject line option 2]"
 
#### Video Ideas
- "[Video concept and key points to cover]"
 
#### Documentation Updates Needed
- [ ] Update [doc page] with [new info]
- [ ] Add [new guide] for [feature]
\`\`\`
 
## Example Analysis
 
When user requests content suggestions, follow this workflow:
1. Check git log for recent commits
2. Read relevant files to understand the changes
3. Categorize changes by impact
4. Generate specific content suggestions with drafts
5. Prioritize based on user-facing value
6. Consider SEO and distribution opportunities
 
## Notes
 
- Use diff output to AI to write what's new (as mentioned in the thread)
- Focus on customer-centric messaging (see [customer-centric-messaging.md](mdc:docs/customer-centric-messaging.md))
- Treat every release like a launch event to maximize Perplexity/search discovery
- Quality traffic comes from early engagement rallying