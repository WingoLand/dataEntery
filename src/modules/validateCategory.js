export default (genCategory, newCategory, category) => {
  // Helper function to normalize category values
  const normalize = (value) => {
    if (!value || typeof value !== "string") return ""; // Handle invalid inputs
    return value.trim().toLowerCase();
  };

  // Normalize all category values
  const normalizedGenCategory = normalize(genCategory);
  const normalizedNewCategory = normalize(newCategory);
  const normalizedCategory = normalize(category);

  // Determine the effective category to use
  const effectiveCategory = normalizedNewCategory || normalizedCategory;

  // If genCategory is not set, initialize it
  if (!normalizedGenCategory) {
    return effectiveCategory; // Return the new category to set
  }

  // Ensure all words belong to the same category
  if (normalizedGenCategory !== effectiveCategory) {
    throw new Error("All words must belong to the same category.");
  }

  // Return the existing genCategory if everything is valid
  return normalizedGenCategory;
};
