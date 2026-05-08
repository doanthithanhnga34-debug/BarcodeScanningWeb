const RECENT_BRANCHES_KEY = "recentBranch";
export function saveRecentBranch(branch) {
  const recentBranches = getRecentBranches();
  const filtered = recentBranches.filter((item) => {
    item.id !== branch.id;
  });
  filtered.unshift(branch);
  const limited = filtered.slice(0, 5);
  localStorage.setItem(RECENT_BRANCHES_KEY, JSON.stringify(limited));
}
export function getRecentBranches() {
  const data = localStorage.getItem(
    RECENT_BRANCHES_KEY
  );

  return data ? JSON.parse(data) : [];
}
