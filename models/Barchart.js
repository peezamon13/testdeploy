import { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const Barchart = () => {
  const [database, setDatabase] = useState(process.env.APP_DATABASE || 'food-ordering');
  const [collection, setCollection] = useState(process.env.APP_COLLECTION || 'orders');
  const [mongoURI, setMongoURI] = useState(process.env.MONGODB_URI);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Get the canvas element
        const canvas = document.getElementById('myChart');

        // Check if the canvas element exists
        if (!canvas) {
          console.error("Canvas element with id 'myChart' not found");
          return;
        }

        const ctx = canvas.getContext('2d');

        // 2. Connect to MongoDB
        const mongoClient = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        await mongoClient.connect();

        const db = mongoClient.db(database);
        const collection = db.collection(collection);

        // 3. Fetch data from MongoDB
        const docs = await collection.find().toArray();

        // 4. Create a new Chart instance
        var newChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: docs.map((doc) => doc.label),
            datasets: [{
              label: 'Sample Data',
              data: docs.map((doc) => doc.value),
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });

        // Cleanup on component unmount
        return () => {
          mongoClient.close();
        };
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, [database, collection, mongoURI]);

  return (
    <div>
      <canvas id="myChart" width="400" height="400"></canvas>
    </div>
  );
};

export default Barchart;
