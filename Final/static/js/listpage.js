function goBack() {
    window.history.back();
}

document.addEventListener('DOMContentLoaded', () => {
    // Call sortRecipes to apply the default sorting when the page loads
    sortRecipes();
});

function sortRecipes() {
    const sortOption = document.getElementById('sort').value;
    const recipeContainer = document.getElementById('recipeContainer');
    const recipes = Array.from(recipeContainer.getElementsByClassName('recipe-card'));

    if (sortOption === 'default') {
        recipes.sort((a, b) => parseInt(a.getAttribute('data-index-no')) - parseInt(b.getAttribute('data-index-no')));
    } else if (sortOption === 'TotalTimeInMinsAsc') {
        recipes.sort((a, b) => parseInt(a.getAttribute('data-total-time')) - parseInt(b.getAttribute('data-total-time')));
    } else if (sortOption === 'TotalTimeInMinsDesc') {
        recipes.sort((a, b) => parseInt(b.getAttribute('data-total-time')) - parseInt(a.getAttribute('data-total-time')));
    }

    // Reorder recipes in the container
    recipes.forEach(recipe => recipeContainer.appendChild(recipe));
}