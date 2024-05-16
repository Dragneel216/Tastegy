from flask import Flask, request, render_template, jsonify, g
import requests
import pandas as pd
import numpy as np
import re
import spacy
import string
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
from sklearn.metrics.pairwise import cosine_similarity
from bs4 import BeautifulSoup
import multiprocessing as mp
from sklearn.decomposition import NMF
from sklearn.decomposition import LatentDirichletAllocation as LDA

app = Flask(__name__, static_folder="static")

df=pd.read_csv("IndianFoodDatasetCSV.csv")
df

#Cleaning to Prepare for Tokenizing
# Removing ADVERTISEMENT text from ingredients list
ingredients = []
for ing_list in df['TranslatedIngredients']:
    # Check if ing_list is not NaN (float)
    if not isinstance(ing_list, float):
        # Clean the ingredients by removing 'ADVERTISEMENT' and stripping whitespace
        clean_ings = [ing_list]
        ingredients.append(clean_ings)
    else:
        # Handle NaN values if needed
        ingredients.append([])  # Append an empty list as placeholder for NaN
df['TranslatedIngredients'] = ingredients
df.loc[0,'TranslatedIngredients']

# Convert ingredients, dietary preferences, and cuisine type into a single string for each recipe
df['RecipeText'] = df['TranslatedIngredients'].apply(' '.join) + ' ' + df['Diet'] + ' ' + df['Cuisine']
corpus = df['RecipeText'].tolist()

# Initialize and fit TF-IDF vectorizer
tfidf_vectorizer = TfidfVectorizer()
recipe_tfidf_matrix = tfidf_vectorizer.fit_transform(corpus)

# Function to recommend recipes based on user input, dietary preferences, cuisine type, and sorting criteria
def recommend_recipes(user_ingredients, user_dietary_preference, user_cuisine_type, sort_by='default'):
    # Combine user input into a single string
    global indices
    user_input = user_ingredients + ' ' + user_dietary_preference+ ' ' + user_cuisine_type

    # Transform user input into TF-IDF vector
    user_input_tfidf_vector = tfidf_vectorizer.transform([user_input])

    # Calculate cosine similarity between user input and recipes
    similarity_scores = cosine_similarity(user_input_tfidf_vector, recipe_tfidf_matrix)

    # Get indices of recommended recipes
    top_indices = similarity_scores.argsort()[0][-10:][::-1]

    # Get recommended recipes
    recommended_recipes = df.iloc[top_indices]
    for index, row in recommended_recipes.iterrows():
            recommended_recipes.at[index, 'IndexNo'] = index
    return recommended_recipes

@app.route("/")
def home():
    # Display the home (using render_template)
    return render_template("home.html")

@app.route("/search")
def findRecipes():
    # Display the form (using render_template)
    return render_template("recipeSearchPage.html")

@app.route("/about")
def aboutUs():
    # Display the form (using render_template)
    return render_template("aboutPage.html")

@app.route("/contact")
def contactUs():
    # Display the form (using render_template)
    return render_template("contactPage.html")

@app.route("/login")
def login():
    # Display the login page (using render_template)
    return render_template("loginPage.html")

@app.route("/tips")
def tip():
    return render_template("tipPage.html")

@app.route("/recommend", methods=["GET", "POST"])
def recommend():
    # Process form data
    user_ingredients = request.form["ingredients"]
    user_dietary_preference = request.form.get("diet","")
    user_cuisine_type = request.form.get("cuisine","")
    sort_by = 'default' #  or 'preparation_time' 'TotalTimeInMins'
    recommended_recipes = recommend_recipes(user_ingredients, user_dietary_preference, user_cuisine_type, sort_by=sort_by)

    for index, row in recommended_recipes.iterrows():
            recipe_url = row['URL']
            image_urls = scrape_images(recipe_url)
            recommended_recipes.at[index, 'ImageURLs'] = image_urls

    # print("Recommended recipes sorted by", sort_by)
    # print(recommended_recipes)
    user_ingredients = ""
    user_dietary_preference = ""
    user_cuisine_type = ""
    return render_template("listPage.html", recommended_recipes=recommended_recipes.to_dict(orient='records'))
    # Display recommended recipes

@app.route("/recipe/<int:recipe_id>")
def recipe_details(recipe_id):
    # Call a function to retrieve the recipe details based on recipe_id
    recipe = get_recipe_details(recipe_id)  # Define this function to fetch recipe details
    image_url = scrape_images(recipe.URL)
    recipe['ImageURLs'] = image_url[0]
    print(recipe)
    if recipe is None:
        # Handle case where recipe is not found
        return render_template("error.html", message="Recipe not found"), 404
    else:
        # Render the recipe details template with the retrieved recipe data
        return render_template("recipeDetails.html", recipe=recipe)
    
def get_recipe_details(recipe_id):
    # Assuming `df` is your Pandas DataFrame containing recipe data
    recipe = df[df['Srno'] == recipe_id].iloc[0]  # Replace 'Srno' with your unique identifier
    return recipe

def scrape_images(url):
    specific_image_urls = []
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    class_name = 'img-fluid img-thumbnail'  # Change this to match the class name of the images you want to scrape
    # Find all image elements with the specified class name
    img_tags = soup.find_all('img', class_=class_name)
    
    # Extract image URLs
    for img_tag in img_tags:
        img_url = img_tag.get('src')
        if img_url:
            img_url = "https://www.archanaskitchen.com/"+img_url
            specific_image_urls.append(img_url)
    
    return specific_image_urls

if __name__ == "__main__":
   app.run(debug = True)