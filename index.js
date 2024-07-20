document.addEventListener('DOMContentLoaded', () => {
// Default image URL (will be set after fetching the data)
let defaultImageUrl = '';

// Fetch building data on page load
fetch('http://localhost:3000/buildings')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Get the last image from the 'luxurious' category
        const luxuriousBuildings = data.luxurious;
        const lastBuilding = luxuriousBuildings[luxuriousBuildings.length - 1];
        defaultImageUrl = lastBuilding.image;
        console.log(defaultImageUrl)
        // Optionally, display the last building's details as a default
        displayBuilding(lastBuilding);
    })
    .catch(error => {
        console.error('Error fetching building details:', error);
        // Set a fallback default image if there's an error
        defaultImageUrl = './images/apartment-luxury.jpg';
        displayBuilding(null);
    });



  // Event listener for form submission
  document.getElementById('cost-estimator-form').addEventListener('submit', function(event) {
      event.preventDefault();

      const buildingType = document.getElementById('building-type').value;
      const buildingCategory = document.getElementById('building-category').value;
      const constructionArea = parseFloat(document.getElementById('floor-area').value);
      const numberOfFloors = parseInt(document.getElementById('floors').value);

      document.getElementById('loading').style.display = 'block';

      const unitCosts = {
          mansionette: {
              standard: 40000,
              luxurious: 50000
          },
          mansion: {
              standard: 50000,
              luxurious: 60000
          },
          apartment: {
              standard: 40000,
              luxurious: 60000
          }
      };

      const laborMaterialRatio = 0.7; // Assume 70% for labor, 30% for materials

      if (!buildingType || !buildingCategory || isNaN(constructionArea) || isNaN(numberOfFloors) || constructionArea <= 0 || numberOfFloors <= 0) {
          alert('Please fill in all fields correctly.');
          document.getElementById('loading').style.display = 'none';
          return;
      }

      setTimeout(() => {
          // Calculate construction cost
          const constructionCostPerSqm = unitCosts[buildingType][buildingCategory];
          const constructionCost = constructionCostPerSqm * constructionArea * numberOfFloors;

          // Calculate labor and material costs
          const totalLaborCost = constructionCost * laborMaterialRatio;
          const totalMaterialCost = constructionCost - totalLaborCost;

          // Display the results
          const resultDiv = document.getElementById('result');
          resultDiv.innerHTML = `
              <strong>Estimated Construction Cost Breakdown:</strong><br><br>
              <strong>Total Construction Cost:</strong> Ksh ${constructionCost.toFixed(2)}<br>
              <strong>Labor Cost:</strong> Ksh ${totalLaborCost.toFixed(2)}<br>
              <strong>Material Cost:</strong> Ksh ${totalMaterialCost.toFixed(2)}<br>
          `;

          document.getElementById('loading').style.display = 'none';
      }, 1000);

      // Fetch and display the building details based on user input
      fetch(`http://localhost:3000/buildings`)
          .then(response => {
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              return response.json();
          })
          .then(data => {
            console.log(data)
              const buildingData = data[buildingCategory];
              const building = buildingData.find(b => b.type === buildingType);
              console.log(building)
              displayBuilding(building);
          })
          .catch(error => {
              console.error('Error fetching building details:', error);
          });
  });

  function displayBuilding(building) {
      let image = document.getElementById('image');
      let description = document.getElementById('description');

      if (building) {
          image.src = building.image;
          console.log(building.image)
          description.innerHTML = building.description
      } else {
          
          image.src = defaultImageUrl || fallbackDefaultImageUrl;
          description.innerHTML = 'No data available for the selected type and category';
      }
  }
});