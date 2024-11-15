document.addEventListener("DOMContentLoaded", function() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!loggedInUser) {
        // If no user is logged in, redirect to login
        window.location.href = "../forms/login.html";
    } else if (loggedInUser.role !== "admin") {
        // If the user is not a manager, redirect to login or another page
        window.location.href = "../index.html";
    } else {
        // Display manager-specific content
        console.log("Welcome Manager!");
    }
});

// Logout function
function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "../index.html";  // Redirect back to login page
}


// Date and Time Script
const dateTimeElem = document.getElementById("dateTime");
setInterval(() => {
    const now = new Date();
    const day = now.toLocaleDateString('fr-FR', { weekday: 'long' });
    const date = now.toLocaleDateString('fr-FR');
    const time = now.toLocaleTimeString('fr-FR');

    dateTimeElem.textContent = `${day.charAt(0).toUpperCase() + day.slice(1)} ${date} | ${time}`;
}, 1000);


// Initialize Supabase
const supabaseUrl = 'https://tgwdhdascgmwyjorevyf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnd2RoZGFzY2dtd3lqb3JldnlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAwNzg1MjcsImV4cCI6MjA0NTY1NDUyN30.Dn04vhFonpePpuXsjRohDpJn6m55c_gMdtfAT0-ADWI';

const { createClient } = supabase;  // Destructure createClient from supabase
const supabaseClient = createClient(supabaseUrl, supabaseKey)

// Fetch all required data
async function fetchDashboardData() {
    const { data, error } = await supabaseClient
        .from('orders')
        .select('pizza_price, quantity, client_name')

    if (error) {
        console.error('Error fetching dashboard data:', error)
        return
    }

    // Total Income: Sum of all prices
    const totalIncome = data.reduce((acc, order) => acc + parseFloat(order.pizza_price) || 0, 0)

    // Total Orders: Count of all orders
    const totalOrders = data.length;

    // Unique Clients: Count of distinct client names
    const uniqueClients = new Set(data.map(order => order.client_name)).size;

    // Total Pizzas Sold: Sum of all quantities
    const totalPizzas = data.reduce((acc, order) => acc + parseInt(order.quantity) || 0, 0);

    // Update the dashboard with fetched data
    document.getElementById('revenu').innerText = `${totalIncome.toFixed(2)} CFA`
    document.getElementById('order').innerText = totalOrders
    document.getElementById('client').innerText = uniqueClients
    document.getElementById('total_pizza').innerText = totalPizzas
    }

// Call the function to populate the dashboard
fetchDashboardData()

async function fetchDeliveryManData() {
    const { data, error } = await supabaseClient
        .from('orders')
        .select('assigned_deliveryman, quantity, pizza_price, prix_zone')

    if (error) {
        console.error('Error fetching delivery man data:', error)
        return
    }

    // Group orders by delivery man and calculate total quantity, price, and price zones
    const deliveryData = data.reduce((acc, order) => {
        const deliveryMan = order.assigned_deliveryman

        if (!acc[deliveryMan]) {
        acc[deliveryMan] = {
            totalQuantity: 0,
            totalPrice: 0,
            totalPriceZones: 0 // This will store the sum of price zones
        }
        }

        // Add quantity and price to the totals
        acc[deliveryMan].totalQuantity += parseInt(order.quantity) || 0
        acc[deliveryMan].totalPrice += parseFloat(order.pizza_price) || 0

        // Add the prix_zone value (sum all prix_zone values)
        acc[deliveryMan].totalPriceZones += parseFloat(order.prix_zone) || 0

        return acc
    }, {})

    // Generate HTML for each delivery man
    const deliveryManContainer = document.getElementById('delivery-man-details')
    deliveryManContainer.innerHTML = '' // Clear any existing content

    // Iterate over each delivery man and display their data
    Object.keys(deliveryData).forEach(deliveryMan => {
        const { totalQuantity, totalPrice, totalPriceZones } = deliveryData[deliveryMan]

        // Calculate the boss's share (20% of the total price zone)
        const bossShare = totalPriceZones * 0.2

        // Create a box for each delivery man
        const deliveryBox = document.createElement('div')
        deliveryBox.classList.add('delivery-box')

        // Add content to the delivery box
        deliveryBox.innerHTML = `
        <h5>${deliveryMan}</h5>
        <p><strong>Total Quantity Delivered:</strong> ${totalQuantity}</p>
        <p><strong>Total Price:</strong> ${totalPrice.toFixed(2)} CFA</p>
        <p><strong>Total Price Zone:</strong> ${totalPriceZones.toFixed(2)} CFA</p>
        <p><strong>Boss's Share (20%):</strong> ${bossShare.toFixed(2)} CFA</p>
        `

        // Append the box to the container
        deliveryManContainer.appendChild(deliveryBox)
    })
    }

// Call the function to fetch and display data
fetchDeliveryManData()



// Afficher par semaine et par mois
// Par semaine
semaine = document.getElementById('semaine');
mois = document.getElementById('mois');

// for the dashboard data
async function fetchDashboardDataWeek() {
    const { data, error } = await supabaseClient
        .from('orders_week')
        .select('pizza_price, quantity, client_name')

    if (error) {
        console.error('Error fetching dashboard data:', error)
        return
    }

    // Total Income: Sum of all prices
    const totalIncome = data.reduce((acc, order) => acc + parseFloat(order.pizza_price) || 0, 0)

    // Total Orders: Count of all orders
    const totalOrders = data.length;

    // Unique Clients: Count of distinct client names
    const uniqueClients = new Set(data.map(order => order.client_name)).size;

    // Total Pizzas Sold: Sum of all quantities
    const totalPizzas = data.reduce((acc, order) => acc + parseInt(order.quantity) || 0, 0);

    // Update the dashboard with fetched data
    document.getElementById('revenu').innerText = `${totalIncome.toFixed(2)} CFA`
    document.getElementById('order').innerText = totalOrders
    document.getElementById('client').innerText = uniqueClients
    document.getElementById('total_pizza').innerText = totalPizzas
    }



//Pour les livreurs 

async function fetchDeliveryManDataWeek() {
    const { data, error } = await supabaseClient
        .from('orders_week')
        .select('assigned_deliveryman, quantity, pizza_price, prix_zone')

    if (error) {
        console.error('Error fetching delivery man data:', error)
        return
    }

    // Group orders by delivery man and calculate total quantity, price, and price zones
    const deliveryData = data.reduce((acc, order) => {
        const deliveryMan = order.assigned_deliveryman

        if (!acc[deliveryMan]) {
        acc[deliveryMan] = {
            totalQuantity: 0,
            totalPrice: 0,
            totalPriceZones: 0 // This will store the sum of price zones
        }
        }

        // Add quantity and price to the totals
        acc[deliveryMan].totalQuantity += parseInt(order.quantity) || 0
        acc[deliveryMan].totalPrice += parseFloat(order.pizza_price) || 0

        // Add the prix_zone value (sum all prix_zone values)
        acc[deliveryMan].totalPriceZones += parseFloat(order.prix_zone) || 0

        return acc
    }, {})

    // Generate HTML for each delivery man
    const deliveryManContainer = document.getElementById('delivery-man-details')
    deliveryManContainer.innerHTML = '' // Clear any existing content

    // Iterate over each delivery man and display their data
    Object.keys(deliveryData).forEach(deliveryMan => {
        const { totalQuantity, totalPrice, totalPriceZones } = deliveryData[deliveryMan]

        // Calculate the boss's share (20% of the total price zone)
        const bossShare = totalPriceZones * 0.2

        // Create a box for each delivery man
        const deliveryBox = document.createElement('div')
        deliveryBox.classList.add('delivery-box')

        // Add content to the delivery box
        deliveryBox.innerHTML = `
        <h5>${deliveryMan}</h5>
        <p><strong>Total Quantity Delivered:</strong> ${totalQuantity}</p>
        <p><strong>Total Price:</strong> ${totalPrice.toFixed(2)} CFA</p>
        <p><strong>Total Price Zone:</strong> ${totalPriceZones.toFixed(2)} CFA</p>
        <p><strong>Boss's Share (20%):</strong> ${bossShare.toFixed(2)} CFA</p>
        `

        // Append the box to the container
        deliveryManContainer.appendChild(deliveryBox)
    })
    };



// Par mois
// for the dashboard data
async function fetchDashboardDataMonth() {
    const { data, error } = await supabaseClient
        .from('orders_months')
        .select('pizza_price, quantity, client_name')

    if (error) {
        console.error('Error fetching dashboard data:', error)
        return
    };

    // Total Income: Sum of all prices
    const totalIncome = data.reduce((acc, order) => acc + parseFloat(order.pizza_price) || 0, 0)

    // Total Orders: Count of all orders
    const totalOrders = data.length;

    // Unique Clients: Count of distinct client names
    const uniqueClients = new Set(data.map(order => order.client_name)).size;

    // Total Pizzas Sold: Sum of all quantities
    const totalPizzas = data.reduce((acc, order) => acc + parseInt(order.quantity) || 0, 0);

    // Update the dashboard with fetched data
    document.getElementById('revenu').innerText = `${totalIncome.toFixed(2)} CFA`
    document.getElementById('order').innerText = totalOrders
    document.getElementById('client').innerText = uniqueClients
    document.getElementById('total_pizza').innerText = totalPizzas
    };



//Pour les livreurs 

async function fetchDeliveryManDataMonth() {
    const { data, error } = await supabaseClient
        .from('orders_months')
        .select('assigned_deliveryman, quantity, pizza_price, prix_zone')

    if (error) {
        console.error('Error fetching delivery man data:', error)
        return
    }

    // Group orders by delivery man and calculate total quantity, price, and price zones
    const deliveryData = data.reduce((acc, order) => {
        const deliveryMan = order.assigned_deliveryman

        if (!acc[deliveryMan]) {
        acc[deliveryMan] = {
            totalQuantity: 0,
            totalPrice: 0,
            totalPriceZones: 0 // This will store the sum of price zones
        }
        };

        // Add quantity and price to the totals
        acc[deliveryMan].totalQuantity += parseInt(order.quantity) || 0
        acc[deliveryMan].totalPrice += parseFloat(order.pizza_price) || 0

        // Add the prix_zone value (sum all prix_zone values)
        acc[deliveryMan].totalPriceZones += parseFloat(order.prix_zone) || 0

        return acc
    }, {})

    // Generate HTML for each delivery man
    const deliveryManContainer = document.getElementById('delivery-man-details')
    deliveryManContainer.innerHTML = '' // Clear any existing content

    // Iterate over each delivery man and display their data
    Object.keys(deliveryData).forEach(deliveryMan => {
        const { totalQuantity, totalPrice, totalPriceZones } = deliveryData[deliveryMan]

        // Calculate the boss's share (20% of the total price zone)
        const bossShare = totalPriceZones * 0.2

        // Create a box for each delivery man
        const deliveryBox = document.createElement('div')
        deliveryBox.classList.add('delivery-box')

        // Add content to the delivery box
        deliveryBox.innerHTML = `
        <h5>${deliveryMan}</h5>
        <p><strong>Total Quantity Delivered:</strong> ${totalQuantity}</p>
        <p><strong>Total Price:</strong> ${totalPrice.toFixed(2)} CFA</p>
        <p><strong>Total Price Zone:</strong> ${totalPriceZones.toFixed(2)} CFA</p>
        <p><strong>Boss's Share (20%):</strong> ${bossShare.toFixed(2)} CFA</p>
        `

        // Append the box to the container
        deliveryManContainer.appendChild(deliveryBox)
    })
    }

// Open the IndexedDB database
let db;
const request = indexedDB.open("pizzaInventoryDB", 1); // Use your database name here

request.onsuccess = (event) => {
    db = event.target.result;
    console.log("Database opened successfully");
    fetchInventoryData(); // Call to fetch and display data after the DB is opened
};

request.onerror = (event) => {
    console.log("Database error: " + event.target.errorCode);
};

// Function to fetch inventory data from IndexedDB
function fetchInventoryData() {
    const transaction = db.transaction(["inventory"], "readonly"); // Access 'inventory' object store
    const objectStore = transaction.objectStore("inventory");
    const getAllRequest = objectStore.getAll(); // Get all records from the 'inventory' table

    getAllRequest.onsuccess = (event) => {
        const inventoryData = event.target.result;
        console.log("Fetched Inventory Data: ", inventoryData);
        displayInventoryTable(inventoryData); // Pass the data to the table rendering function
    };

    getAllRequest.onerror = (event) => {
        console.error("Error fetching inventory data", event);
    };
}

// Function to display the inventory data in the table
function displayInventoryTable(inventoryData) {
    const tableBody = document.getElementById("inventoryTableBody"); // The table body element

    // Clear existing rows
    tableBody.innerHTML = '';

    // Loop through the inventory data and add rows to the table
    inventoryData.forEach((inventoryItem) => {
        const row = document.createElement("tr");

        // Create table cells for each item
        row.innerHTML = `
            <td>${inventoryItem.date}</td>
            <td>${inventoryItem.smallPizza}</td>
            <td>${inventoryItem.largePizza}</td>
            <td>${inventoryItem.pizzaDeliveredCount}</td>
            <td>${inventoryItem.pizzaLeftCount}</td>
        `;
        
        tableBody.appendChild(row);
    });
}

async function loadOrders() {
    // Fetch data from the "orders" table and include the "id" column
    let { data, error } = await supabaseClient
        .from('orders')
        .select('order_id, client_name, client_number, pizza_size, pizza_name, pizza_price, quantity, delivery_adress, delivery_hour, payment_method, assigned_deliveryman, prix_zone, create_at');

    if (error) {
        console.error('Error fetching orders:', error);
        return;
    }

    const tableBody = document.getElementById('orders-table-body');
    tableBody.innerHTML = '';  // Clear existing data

    data.forEach((order, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${order.client_name}</td>
            <td>${order.client_number}</td>
            <td>${order.pizza_size}</td>
            <td>${order.pizza_name}</td>
            <td>${order.pizza_price}</td>
            <td>${order.quantity}</td>
            <td>${order.delivery_adress}</td>
            <td>${order.delivery_hour}</td>
            <td>${order.payment_method}</td>
            <td>${order.assigned_deliveryman}</td>
            <td>${order.prix_zone}</td>
            <td>${order.create_at}</td>
            `;
        tableBody.appendChild(row);
    });
}

// Call loadOrders initially to load all orders without filtering
loadOrders();

// Function to fetch data from Supabase
async function fetchSalesData() {
    const { data, error } = await supabaseClient
        .from('orders')  // replace with your table name
        .select('create_at, quantity')  // specify the columns you want to retrieve

    if (error) {
        console.error('Error fetching data:', error);
        return;
    }

    // Format the date and return the data for charting
    const formattedData = data.map(row => ({
        date: new Date(row.date).toISOString().split('T')[0],  // Extract date only (YYYY-MM-DD)
        delivery_count: row.delivery_count
    }));

    // Pass formatted data to the charting function
    renderSalesChart(formattedData);
}

fetchSalesData();

// Function to render the sales chart
function renderSalesChart(salesData) {
    const ctx = document.getElementById('pizzaSalesChart').getContext('2d');

    new Chart(ctx, {
        type: 'line',  // You can change this to 'bar' if you prefer
        data: {
            labels: salesData.map(item => item.create_at),  // X-axis: dates
            datasets: [{
                label: 'Pizza Deliveries',
                data: salesData.map(item => item.quantity),  // Y-axis: delivery counts
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Pizza Sales Over Time'
                },
                legend: {
                    display: false  // Hide the legend if you don’t need it
                }
            },
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}