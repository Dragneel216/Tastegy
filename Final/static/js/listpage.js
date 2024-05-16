function goBack() {
    window.history.back();
}

function sortRecipes() {
    const sortOption = document.getElementById('sort').value;
    const recipeContainer = document.getElementById('recipeContainer');
    const recipes = Array.from(recipeContainer.getElementsByClassName('recipe-card'));

    if (sortOption === 'TotalTimeInMinsAsc') {
        recipes.sort((a, b) => parseInt(a.getAttribute('data-total-time')) - parseInt(b.getAttribute('data-total-time')));
    } else if (sortOption === 'TotalTimeInMinsDesc') {
        recipes.sort((a, b) => parseInt(b.getAttribute('data-total-time')) - parseInt(a.getAttribute('data-total-time')));
    }

    // Reorder recipes in the container
    recipes.forEach(recipe => recipeContainer.appendChild(recipe));
}