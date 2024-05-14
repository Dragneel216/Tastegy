from flask import Flask, request, render_template, jsonify
import pandas as pd
import numpy as np
import re
import spacy
import string
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
from sklearn.metrics.pairwise import cosine_similarity
import multiprocessing as mp
from sklearn.decomposition import NMF
from sklearn.decomposition import LatentDirichletAllocation as LDA

'''
user_ingredients = ""
user_dietary_preference = ""
user_cuisine_type = ""
'''
app = Flask(__name__)


df=pd.read_csv("IndianFoodDatasetCSV.csv")
df
# #this will give the number of rows and columns
# df.shape
# # Count of missing values by category
# df.isna().sum()
# df.shape
# df.dtypes
# # Indexing rows with columns that only contain numbers or punctuation
# ingred_index = [index for i, index in zip(df['TranslatedIngredients'], df.index) if isinstance(i, str) and all(j.isdigit() or j in string.punctuation for j in i)]
# recipe_index = [index for i, index in zip(df['RecipeName'], df.index) if isinstance(i, str) and all(j.isdigit() or j in string.punctuation for j in i)]
# instru_index = [index for i, index in zip(df['Instructions'], df.index) if isinstance(i, str) and all(j.isdigit() or j in string.punctuation for j in i)]

# # Checking number of rows in each category that are only punc/nums
# index_list = [ingred_index, recipe_index, instru_index]
# [len(x) for x in index_list]

# # Recipe instructions with less than 20 characters are not good recipes
# empty_instr_ind = [index for i, index in zip(df['Instructions'], df.index) if len(i) < 20]
# recipes = df.drop(index = empty_instr_ind).reset_index(drop=True)
# df.shape
# df.isna().sum()

# # Checking for low ingredient recipes.
# #low_ingr_ind = [index for i, index in zip(df['ingredients'], df.index) if len(i) < 20]
# low_ingr_index = [index for index, i in df['TranslatedIngredients'].items() if isinstance(i, list) and pd.isna(i[0])]
# print(len(low_ingr_index))
# print(df.loc[low_ingr_index, 'TranslatedIngredients'])

# # Searching for pseudo empty lists
# indices_with_nan = [index for index, ingredients in df['TranslatedIngredients'].items() if isinstance(ingredients, list) and any(np.isnan(x) for x in ingredients)]
# indices_with_nan

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
    user_input = user_ingredients + ' ' + user_dietary_preference+ ' ' + user_cuisine_type

    # Transform user input into TF-IDF vector
    user_input_tfidf_vector = tfidf_vectorizer.transform([user_input])

    # Calculate cosine similarity between user input and recipes
    similarity_scores = cosine_similarity(user_input_tfidf_vector, recipe_tfidf_matrix)

    # Get indices of recommended recipes
    top_indices = similarity_scores.argsort()[0][-10:][::-1]

    # Sort recommended recipes by preparation time if selected
    if sort_by == 'TotalTimeInMins':
        sorted_indices = df.iloc[top_indices]['TotalTimeInMins'].argsort()
        top_indices = top_indices[sorted_indices]

    # Get recommended recipes
    
    recommended_recipes = df.iloc[top_indices]
    return recommended_recipes

# Example user input
# user_ingredients = "rice,black gram,yeast"
# user_dietary_preference = "Vegetarian"
# user_cuisine_type = ""
# sort_by = 'default' # or 'preparation_time' 'TotalTimeInMins'

# Recommend recipes based on user input, dietary preferences, cuisine type, and sorting criteria
# recommended_recipes = recommend_recipes(user_ingredients, user_dietary_preference, user_cuisine_type, sort_by=sort_by)

# Display recommended recipes
# print("Recommended recipes sorted by", sort_by)
# print(recommended_recipes)

@app.route("/")
def home():
    # Display the form (using render_template)
    return render_template("recipeSearchPage.html")

@app.route("/recommend", methods=["POST"])
def recommend():
    # Process form data
    user_ingredients = request.form["ingredients"]
    user_dietary_preference = request.form.get("diet","")
    user_cuisine_type = request.form.get("cuisine","")
    sort_by = 'default' #  or 'preparation_time' 'TotalTimeInMins'
    recommended_recipes = recommend_recipes(user_ingredients, user_dietary_preference, user_cuisine_type, sort_by=sort_by)

    print("Recommended recipes sorted by", sort_by)
    print(recommended_recipes)
    user_ingredients = ""
    user_dietary_preference = ""
    user_cuisine_type = ""
    return render_template("listpage.html", recommended_recipes=recommended_recipes.to_dict(orient='records'))
    # Display recommended recipes

@app.route("/recipe/<int:recipe_id>")
def recipe_details(recipe_id):
    # Call a function to retrieve the recipe details based on recipe_id
    recipe = get_recipe_details(recipe_id)  # Define this function to fetch recipe details
    if recipe is None:
        # Handle case where recipe is not found
        return render_template("error.html", message="Recipe not found"), 404
    else:
        # Render the recipe details template with the retrieved recipe data
        return render_template("recipe_details.html", recipe=recipe)
    
def get_recipe_details(recipe_id):
    # Assuming `df` is your Pandas DataFrame containing recipe data
    recipe = df[df['Srno'] == recipe_id].iloc[0]  # Replace 'Srno' with your unique identifier
    return recipe



if __name__ == "__main__":
   app.run(debug = True)
