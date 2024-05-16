const tips = {
    Kitchen: [
        "Use Different Cutting Boards: Use separate cutting boards for raw meat, poultry, vegetables, and other foods to prevent cross-contamination. Color-coded boards can help you remember which board is used for each type of food.",
        "Clean As You Go: Wash utensils, cutting boards, and bowls as you cook to minimize clutter and make cleanup easier once you're done.",
        "Organize Your Pantry: Keep your pantry organized by grouping similar items together and labeling containers. This makes it easier to find ingredients and prevents food from expiring unnoticed.",
        "Season Food Throughout Cooking: Season food in stages throughout cooking rather than just at the end. This builds layers of flavor and results in a more balanced dish.",
        "Save Vegetable Scraps for Broth: Collect vegetable scraps (e.g., onion skins, carrot peels, celery tops) in a bag in the freezer. Use them to make homemade vegetable broth or stock.",
        "Invest in Quality Cookware: Quality pots, pans, and utensils can make a significant difference in cooking performance. Invest in durable, versatile cookware that suits your cooking style.",
        "Taste as You Cook: Taste your food as you cook and adjust seasoning accordingly. This helps you develop your palate and ensure dishes are seasoned perfectly.",
        "Keep Herbs Fresh: Store fresh herbs like parsley, cilantro, and basil in a jar of water in the refrigerator, covered with a plastic bag. This keeps them fresh longer.",
        "Utilize Kitchen Gadgets: Invest in useful kitchen gadgets like a microplane grater for garlic and ginger, a citrus juicer, or a garlic press to simplify cooking tasks.",
        "Use Leftovers Creatively: Repurpose leftovers into new dishes. For example, leftover roasted chicken can be used in salads, sandwiches, or pasta dishes.",
        "Practice Patience: Allow meats to rest after cooking to redistribute juices. Rest steaks for a few minutes before slicing, and let roasted meats rest under foil before carving.",
        "Master One-Pot Meals: Learn versatile one-pot meals like stir-fries, risottos, and sheet pan dinners for quick and easy cooking with minimal cleanup.",
        "Organize Spices: Arrange spices in a drawer or cabinet where you can see the labels easily. Group them by cuisine (e.g., Italian spices, Indian spices) for quick access.",
        "Master Knife Skills: Learn basic knife skills like chopping, dicing, mincing, and slicing. Proper knife techniques improve efficiency and make cooking more enjoyable.",
        "Label and Date Freezer Items: When freezing leftovers or ingredients, label containers with the contents and date. This helps you identify items easily and prevents food waste."

        // Add more kitchen tips here
    ],
    Cooking: [
        "Knife Skills: Learn proper knife techniques such as chopping, dicing, mincing, and julienning vegetables and herbs.",
        "Boiling and Simmering: Master the art of boiling pasta and simmering sauces or soups at the right temperature.",
        "Sautéing: Cook ingredients quickly in a hot pan with a small amount of oil or butter, stirring continuously.",
        "Pan-Frying: Fry foods in a shallow pan with a moderate amount of oil until crispy and golden brown.",
        "Roasting: Cook vegetables, meats, or fish in the oven at high heat to caramelize and enhance flavors.",
        "Baking: Follow recipes to bake bread, cakes, cookies, and pastries using precise measurements and techniques.",
        "Grilling: Cook meats, vegetables, and seafood over an open flame or grill pan for a smoky flavor.",
        "Steaming: Use a steamer basket or bamboo steamer to cook vegetables, dumplings, and fish while retaining nutrients.",
        "Blanching and Shocking: Quickly boil vegetables or pasta, then transfer to ice water to stop cooking and retain color.",
        "Poaching: Gently cook foods like eggs, fish, or chicken in simmering water or broth until tender.",
        "Making Stocks and Broths: Prepare homemade stocks and broths using bones, vegetables, and aromatics for soups and sauces.",
        "Pat Food Dry Before Cooking: Dry meat and vegetables before cooking to ensure proper browning.",
        "Use the Right Cooking Oil: Use oils with high smoke points for frying and delicate oils for finishing.",
        "Use Citrus Zest: Citrus zest adds brightness and flavor to dishes.",
        "Use a Meat Thermometer: Cook meat to the correct internal temperature for safety and optimal texture."

        // Add more cooking tips here
    ],
    Cutting: [
        "Use a Mandoline for Thin Slices: Use a mandoline for thin, even slices of vegetables.",
        "Keep Fingers Curled: Curl your fingertips under your hand to avoid cutting yourself.",
        "Slice Against the Grain: When cutting meat, slice against the grain for tender pieces.",
        "Use a Sawing Motion for Bread: Use a gentle sawing motion to slice bread without squashing it.",
        "Slice Root Vegetables Lengthwise First: Cut root vegetables like carrots or potatoes in half lengthwise to create a stable base.",
        "Use a Mandoline for Thin Slices: Use a mandoline for thin, even slices of vegetables.",
        "Cut Avocado Without Peeling: Slice avocado in half lengthwise, remove the pit, then score the flesh before scooping it out with a spoon.",
        "Slice Cheese at Room Temperature: Bring cheese to room temperature before slicing for cleaner cuts.",
        "Maintain Consistent Hand Placement: Keep a consistent hand position on the knife handle for control.",
        "Rest Your Knife Hand on the Blade: Rest your guiding hand on top of the knife blade for stability and control.",
        "Slice Citrus for Maximum Juice: Cut citrus fruits crosswise to maximize juice extraction.",
        "Master Different Cuts: Learn various cutting techniques like dicing, mincing, julienning, and chiffonade.",
        "Sharpen Your Knife Before Cutting Tomatoes: A sharp knife will slice through tomatoes without crushing them.",
        "Use a Claw Grip: Hold the food with your non-knife hand using a claw-like grip to protect your fingers.",
        "Use a Bench Scraper for Transfer: Use a bench scraper to transfer chopped ingredients from the cutting board to the pan."
        // Add more cutting tips here
    ]
};

function showTips(category) {
    if (tips[category]) {
        const newWindow = window.open("", "_blank");
        if (newWindow) {
            const generateTip = () => {
                const randomIndex = Math.floor(Math.random() * tips[category].length);
                const tip = tips[category][randomIndex];
                newWindow.document.getElementById("tip").textContent = tip;
            };

            newWindow.document.write(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>${category} Tip</title>
                    <link rel="stylesheet" type="text/css" href="/static/css/tipShowPage.css">
                </head>
                <body>
                    <div class="tip-container">
                        <h1>${category} Tip</h1>
                        <p id="tip"></p>
                        <button onclick="generateTip()">Regenerate</button>
                        <button onclick="window.close()">Back</button>
                    </div>
                    <script>
                        // Define generateTip function within the new window
                        function generateTip() {
                            const randomIndex = Math.floor(Math.random() * ${JSON.stringify(tips[category])}.length);
                            const tip = ${JSON.stringify(tips[category])}[randomIndex];
                            document.getElementById("tip").textContent = tip;
                        }
                    </script>
                </body>
                </html>
            `);

            // Immediately generate the first tip
            generateTip();
            newWindow.document.close();
        }
    }
}
