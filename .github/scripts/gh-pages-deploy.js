(async () => {
  const { execa } = (await import('execa'));
  try {
    await execa("git", ["checkout", "--orphan", "gh-pages"]);
    // Understand if it's dist or build folder
    const folderName = "docs";
    await execa("git", ["--work-tree", folderName, "add", "--all"]);
    await execa("git", ["--work-tree", folderName, "commit", "-m", "gh-pages"]);
    console.log("Pushing to gh-pages...");
    await execa("git", ["push", "origin", "HEAD:gh-pages", "--force"]);
    console.log("Successfully deployed");
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
})();
