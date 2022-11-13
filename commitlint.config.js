module.exports = {
  extends: ["git-commit-emoji"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "🎉 init",
        "✨ feat",
        "🐛 fix",
        "📃 docs",
        "💎 style",
        "♻️ refactor",
        "🎈 perf",
        "🧪 test",
        "🏗️ build",
        "📦 ci",
        "🧹 chore",
        "↩ revert",
      ],
    ],
  },
};
