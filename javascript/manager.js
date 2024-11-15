document.addEventListener("DOMContentLoaded", function() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!loggedInUser) {
        // If no user is logged in, redirect to login
        window.location.href = "../forms/login.html";
    } else if (loggedInUser.role !== "manager") {
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
    window.location.href = "../index.html";  
}



// Initialize Supabase
const supabaseUrl = 'https://tgwdhdascgmwyjorevyf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnd2RoZGFzY2dtd3lqb3JldnlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAwNzg1MjcsImV4cCI6MjA0NTY1NDUyN30.Dn04vhFonpePpuXsjRohDpJn6m55c_gMdtfAT0-ADWI';

const { createClient } = supabase;  // Destructure createClient from supabase
const supabaseClient = createClient(supabaseUrl, supabaseKey)

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
            <td>
                <button class="btn btn-primary btn-sm" onclick="openEditForm('${order.order_id}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteOrder('${order.order_id}')">Delete</button>
            </td>
            `;
        tableBody.appendChild(row);
    });
}

// Call loadOrders initially to load all orders without filtering
loadOrders();







const deleteOrder = async (orderId) => {
    
    try {
        console.log("Attempting to delete order with ID:", orderId); // Confirm orderId is valid here
        const { error } = await supabaseClient
            .from('orders')
            .delete()
            .eq('order_id', orderId);
            location.reload();

            //loadOrders();

        if (error) {
            console.error("Error deleting order:", error.message);
        } else {
            console.log("Order deleted successfully");
        }
    } catch (error) {
        console.error("Unexpected error:", error);
    }
};



// Load orders when the page loads
document.addEventListener('DOMContentLoaded', loadOrders);

// To edit order
let currentOrderId; // Variable to hold the current order ID

// Function to open the edit form and load existing data
function openEditForm(orderId) {
    currentOrderId = orderId; // Set the current order ID

    // Fetch the order details from the Supabase database
    supabaseClient
        .from('orders')
        .select('*')
        .eq('order_id', orderId)
        .single()
        .then(({ data, error }) => {
            if (error) {
                console.error("Error fetching order:", error);
                return;
            }

            // Populate the form fields with the existing order data
            document.getElementById("clientName").value = data.client_name || '';
            document.getElementById("clientNumber").value = data.client_number || '';
            document.getElementById("pizzaName").value = data.pizza_name || '';
            document.getElementById("pizzaSize").value = data.pizza_size || '';
            document.getElementById("pizzaPrice").value = data.pizza_price || '';
            document.getElementById("deliveryAddress").value = data.delivery_adress || '';
            document.getElementById("deliveryTime").value = data.delivery_hour || '';
            document.getElementById("paymentMethod").value = data.payment_method || '';
            document.getElementById("assignedDelivery").value = data.assigned_deliveryman || '';
            document.getElementById('prixZone').value = data.prix_zone || '';
            document.getElementById('quantity').value = data.quantity || ''
            // Display the form
            document.getElementById("editFormContainer").style.display = "flex";
        })
        .catch((error) => {
            console.error("Error fetching order data:", error);
        });
}

// Function to save the updated order
function saveOrder(event) {
    event.preventDefault();

    // Prepare the updated order data
    const updatedOrder = {
        client_name: document.getElementById("clientName").value,
        client_number: document.getElementById("clientNumber").value,
        pizza_name: document.getElementById("pizzaName").value,
        pizza_size: document.getElementById("pizzaSize").value,
        pizza_price: document.getElementById("pizzaPrice").value,
        delivery_adress: document.getElementById("deliveryAddress").value,
        delivery_hour: document.getElementById("deliveryTime").value,
        payment_method: document.getElementById("paymentMethod").value,
        assigned_deliveryman: document.getElementById("assignedDelivery").value,
        prix_zone: document.getElementById('prixZone').value,
        quantity: document.getElementById('quantity').value
    };

    // Save the updated order back to Supabase
    supabaseClient
        .from('orders')
        .update(updatedOrder)
        .eq('order_id', currentOrderId) // Use the current order ID here
        .then(({ data, error }) => {
            if (error) {
                console.error("Error updating order:", error);
                return;
            }

            alert("Order updated successfully!");
            cancelEdit(); // Close the form after saving
            // Optionally refresh the order list here
            location.reload();
        })
        .catch((error) => {
            console.error("Error updating order:", error);
        });
}

// Function to cancel the edit
function cancelEdit() {
    document.getElementById("editFormContainer").style.display = "none";
}


function openAddOrderForm() {
        // Code to open your order form goes here
        document.getElementById("addOrderModal").style.display = "flex"; // Example of showing the form
    }

// To add order
// Function to open the Add Order modal
function openAddOrderForm() {
    document.getElementById("addOrderModal").style.display = "block"; // Show the modal
}

// Function to close the Add Order modal
function closeAddOrderForm() {
    document.getElementById("addOrderModal").style.display = "none"; // Hide the modal
}

// Example save order function
function saveOrders(event) {
    event.preventDefault();
    // Here, you would gather the form data and save it to Supabase
    console.log("Order saved!"); // Replace with your logic

    // After saving, close the modal
    closeAddOrderForm();
}

document.getElementById('addOrderModal').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form data
    const clientNames = document.getElementById('clientNames').value;
    const clientNumbers = parseInt(document.getElementById('clientNumbers').value);
    const pizzaNames = document.getElementById('pizzaNames').value;
    const pizzaSizes = document.getElementById('pizzaSizes').value;
    const pizzaPrices = parseFloat(document.getElementById('pizzaPrices').value);
    const deliveryAddresss = document.getElementById('deliveryAddresss').value;
    const paymentMethods = document.getElementById('paymentMethods').value;
    const assignedDeliverys = document.getElementById('assignedDeliverys').value;
    const deliveryTimes = document.getElementById('deliveryTimes').value;
    const quantityPizza = parseInt(document.getElementById('quantityPizza').value);
    const priceZone = parseInt(document.getElementById('priceZone').value);
    


    // Insert order data into Supabase
    const { data, error } = await supabaseClient
        .from('orders')
        .insert([
            {
                client_name: clientNames,
                client_number: clientNumbers,
                pizza_name: pizzaNames,
                pizza_size: pizzaSizes,
                pizza_price: pizzaPrices,
                quantity: quantityPizza,
                delivery_adress: deliveryAddresss,
                payment_method: paymentMethods,
                assigned_deliveryman: assignedDeliverys,
                delivery_hour: deliveryTimes,
                prix_zone: priceZone
        
            }
        ]);
    location.reload();
    if (error) {
        alert("Error adding order: " + error.message);
    } else {
        alert("Order added successfully!");
        document.getElementById('addOrderModal').reset();
    }
});



async function getOrderCount() {
const { data, error } = await supabaseClient
    .from('orders')
    .select('*', { count: 'exact' })

if (error) {
    console.error('Error fetching order count:', error)
    document.getElementById('nombre_commande').innerText = 'Error'
    return
}

document.getElementById('nombre_commande').innerText = data.length || 0
}

// Fetch and display order count
getOrderCount()

async function getTotalIncome() {
const { data, error } = await supabaseClient
    .from('orders')
    .select('pizza_price') // Select only the price column

if (error) {
    console.error('Error fetching total income:', error)
    document.getElementById('revenu').innerText = 'Error'
    return
}

// Sum up valid prices, treating any non-numeric or null values as zero
const totalIncome = data.reduce((acc, order) => {
    const price = parseFloat(order.pizza_price) || 0 // Convert to a number or default to 0
    return acc + price
}, 0)

document.getElementById('revenu').innerText = `${totalIncome.toFixed(2)} CFA`
};

// Call the function to display total income
getTotalIncome()


// Get the button and modal elements
const endOfDayButton = document.getElementById('endOfDayButton');
const endOfDayModal = new bootstrap.Modal(document.getElementById('endOfDayModal'));
const confirmEndOfDayButton = document.getElementById('confirmEndOfDay');

// When the "End of Day" button is clicked, open the modal
endOfDayButton.addEventListener('click', function() {
endOfDayModal.show();
});

// When the user confirms, perform the "End of Day" action
confirmEndOfDayButton.addEventListener('click', function() {
    alert("Day ended!"); // Replace with actual action (e.g., closing orders)
    endOfDayModal.hide(); // Close the modal
    });



// Function to move orders to past_orders and clear the current orders
async function moveOrders() {
    try {
        // Step 1: Fetch all orders from 'orders' table
        const { data: orders, error: fetchError } = await supabaseClient
            .from('orders')
            .select('*');  // Get all orders

        if (fetchError) throw fetchError;

        // Check if there are orders to move
        if (orders.length === 0) {
            alert("No orders to move.");
            return;
        }

        // Step 2: Insert the fetched orders into 'past_orders' table
        const { data: insertData, error: insertError } = await supabaseClient
            .from('orders_week')
            .insert(orders);  // Insert the orders

        if (insertError) throw insertError;

        // Step 3: Delete the moved orders from the 'orders' table
        const { error: deleteError } = await supabaseClient
            .from('orders')
            .delete()
            .gt('order_id', 0);  // This condition ensures all rows will be deleted

        if (deleteError) throw deleteError;

        location.reload();
    } catch (err) {
        console.error('Error:', err);
        alert("There was an error while moving the orders.");
    }
}


let actionType = "";

// Function to show the modal with a specific message
function showModal(type) {
    actionType = type;
    const modal = document.getElementById("confirmationModal");
    const message = document.getElementById("modalMessage");

    if (type === "Fin de Semaine") {
        message.innerText = "Are you sure you want to finalize the orders for the week?";
    } else if (type === "Sauvegarde (Mois)") {
        message.innerText = "Are you sure you want to finalize the orders for the month?";
    }

    modal.style.display = "flex";
}

// Function to close the modal
function closeModal() {
    document.getElementById("confirmationModal").style.display = "none";
}

// Function to handle confirmation
function confirmAction() {
    if (actionType === "Fin de Semaine") {
        endOfWeek();
    } else if (actionType === "Sauvegarde (Mois)") {
        endOfMonth();
    }
    closeModal();
}

// Placeholder function for end-of-week action
function endOfWeek() {
    async function moveOrdersWeek() {
    try {
        // Step 1: Fetch all orders from 'orders' table
        const { data: orders, error: fetchError } = await supabaseClient
            .from('orders_week')
            .select('*');  // Get all orders

        if (fetchError) throw fetchError;

        // Check if there are orders to move
        if (orders.length === 0) {
            alert("No orders to move.");
            return;
        }

        // Step 2: Insert the fetched orders into 'past_orders' table
        const { data: insertData, error: insertError } = await supabaseClient
            .from('orders_months')
            .insert(orders);  // Insert the orders

        if (insertError) throw insertError;

        // Step 3: Delete the moved orders from the 'orders' table
        const { error: deleteError } = await supabaseClient
            .from('orders_week')
            .delete()
            .gt('order_id', 0);  // This condition ensures all rows will be deleted

        if (deleteError) throw deleteError;

        location.reload();
    } catch (err) {
        console.error('Error:', err);
        alert("There was an error while moving the orders.");
    }
}
    
    moveOrdersWeek();
}

// Placeholder function for end-of-month action
// Main function to handle end of month processing
async function endOfMonth() {
    try {
        // Step 1: Fetch data from the orders_months table
        const { data, error } = await supabaseClient
        .from('orders_months')
        .select('*');

        if (error) {
            console.error("Error fetching data:", error);
            return;
        }

        // Step 2: Convert data to CSV format and trigger download
        const csvContent = convertToCSV(data);
        downloadCSV(csvContent, 'table commandes.csv');

        // Step 3: Generate and download PDF
        generatePDF(data);

        // Step 4: Clear the orders_months table
        const { error: deleteError } = await supabaseClient
            .from('orders_months')
            .delete()
            .gt('order_id', 0);
        
        if (deleteError) {
            console.error("Error clearing table:", deleteError);
            return;
        }

        console.log("Month finalized, orders downloaded as CSV and PDF, and cleared.");
    } catch (error) {
        console.error("Error during end of month process:", error);
    }
};

// Helper function to convert JSON data to CSV format
function convertToCSV(data) {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(',')).join('\n');
    return `${headers}\n${rows}`;
};

// Helper function to trigger a CSV download
function downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// Helper function to generate and download a PDF

function generatePDF(data) {
    const { jsPDF } = window.jspdf; // Access jsPDF
    
    // Create a new PDF document
    const doc = new jsPDF('l', 'mm', 'a4'); // 'p' is for portrait orientation, 'mm' for millimeters, 'a4' is the page size

    // Check if data is provided
    if (!data || data.length === 0) {
        console.error("No data provided for the PDF.");
        return; // Stop execution if there's no data
    }

    doc.setFontSize(16);
    doc.text("Rapport Mensuel des Commandes", 20, 20);

    // Table headers
    const headers = Object.keys(data[0]).map(key => key.replace('_', ' ').toUpperCase());
    
    // Prepare table body
    const tableData = data.map(row => headers.map(header => row[header]));

    // Generate table with autoTable
    doc.autoTable({
        startY: 30, // Position the table starting from Y coordinate 30
        head: [headers], // Table header
        body: tableData, // Table data
        theme: 'grid', // Optional: adds grid lines to the table
        headStyles: {
            fillColor: [255, 255, 255], // Optional: custom header background color
            textColor: [0, 0, 0], // Optional: custom header text color
        }
    });

    // Add summary at the bottom of the table
    const totalPrice = data.reduce((acc, row) => acc + parseFloat(row.pizza_price || 0), 0).toFixed(2);
    const pizzasDelivered = data.reduce((acc, row) => acc + (row.quantity || 0), 0);
    const deliverymen = Array.from(new Set(data.map(row => row.assigned_deliveryman))).join(', ');
    const numberOfClients = new Set(data.map(row => row.client_name)).size;

    // Add the summary text below the table
    const summaryText = `
        Total pizza vendu: $${totalPrice}CFA
        Total pizza livré: ${pizzasDelivered}
        Livreurs: ${deliverymen}
        Nombre des clients: ${numberOfClients}
    `;

    // Positioning the summary below the table (after autoTable finishes rendering)
    const finalY = doc.lastAutoTable.finalY + 10; // Get the Y position after the table
    doc.setFontSize(12);
    doc.text(summaryText, 20, finalY);

    // Download the generated PDF with a dynamic filename
    doc.save('orders_month_report.pdf');
}


// Function to open the modal
function openStockModal() {
    const modal = document.getElementById('addStockModal'); // Get the modal element
    modal.style.display = "block"; // Display the modal (show it)
}

// Function to close the modal
function closeStockModal() {
    const modal = document.getElementById('addStockModal'); // Get the modal element
    modal.style.display = "none"; // Hide the modal
}


// Close the modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById("addStockModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
};


// Pour l'inventaire
// Open IndexedDB database
const openDatabase = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('pizzaInventoryDB', 1);
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('inventory')) {
                const inventoryStore = db.createObjectStore('inventory', { keyPath: 'id', autoIncrement: true });
                inventoryStore.createIndex('date', 'jour', { unique: false });
            }
        };
        
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    });
};

// Add stock item to the database
const addStock = async (stockData) => {
    const db = await openDatabase();
    const transaction = db.transaction('inventory', 'readwrite');
    const store = transaction.objectStore('inventory');
    store.add(stockData);
    transaction.oncomplete = () => console.log('Stock added to inventory');
};

// Get all stock items from the database
const getAllStock = async () => {
    const db = await openDatabase();
    const transaction = db.transaction('inventory', 'readonly');
    const store = transaction.objectStore('inventory');
    const stocks = [];
    store.openCursor().onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
            stocks.push(cursor.value);
            cursor.continue();
        } else {
            console.log('All stock:', stocks);
        }
    };
};

// Update stock item in the database
const updateStock = async (id, updatedData) => {
    const db = await openDatabase();
    const transaction = db.transaction('inventory', 'readwrite');
    const store = transaction.objectStore('inventory');
    const request = store.get(id);
    request.onsuccess = () => {
        const data = request.result;
        Object.assign(data, updatedData);
        store.put(data);
        console.log('Stock updated');
    };
};

// Delete stock item from the database
const deleteStock = async (id) => {
    const db = await openDatabase();
    const transaction = db.transaction('inventory', 'readwrite');
    const store = transaction.objectStore('inventory');
    store.delete(id);
    transaction.oncomplete = () => console.log('Stock deleted');
};

// Submit form event
document.getElementById('stockForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const stockData = {
        jour: document.getElementById('jour').value,
        smallPizza: parseInt(document.getElementById('smallPizza').value),
        largePizza: parseInt(document.getElementById('largePizza').value),
        pizzaDeliveredCount: parseInt(document.getElementById('pizzaDeliveredCount').value),
        pizzaLeftCount: parseInt(document.getElementById('pizzaLeftCount').value),
    };
    addStock(stockData);
    closeStockModal();
});

// Save or update stock data
const saveStock = async (stockData) => {
    const db = await openDatabase();
    const transaction = db.transaction('inventory', 'readwrite');
    const store = transaction.objectStore('inventory');
    
    if (stockData.id) {
        // Update existing entry if id is provided
        store.put(stockData);
        console.log('Stock updated');
    } else {
        // Add new entry
        store.add(stockData);
        console.log('Stock added to inventory');
    }
};

// Handle form submission
document.getElementById('stockForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const stockData = {
        id: document.getElementById('editId').value ? parseInt(document.getElementById('editId').value) : undefined,
        jour: document.getElementById('jour').value,
        smallPizza: parseInt(document.getElementById('smallPizza').value),
        largePizza: parseInt(document.getElementById('largePizza').value),
        pizzaDeliveredCount: parseInt(document.getElementById('pizzaDeliveredCount').value),
        pizzaLeftCount: parseInt(document.getElementById('pizzaLeftCount').value),
    };
    
    await saveStock(stockData);

    // Reset form and close modal
    document.getElementById('stockForm').reset();
    document.getElementById('editId').value = ''; // Clear edit mode
    closeStockModal();

    // Optional: Refresh display data
    console.log("Stock saved successfully:", stockData);
});

// Load stock data into form for editing
const editStock = async (id) => {
    const db = await openDatabase();
    const transaction = db.transaction('inventory', 'readonly');
    const store = transaction.objectStore('inventory');
    const request = store.get(id);
    
    request.onsuccess = () => {
        const data = request.result;
        if (data) {
            document.getElementById('editId').value = data.id;
            document.getElementById('jour').value = data.jour;
            document.getElementById('smallPizza').value = data.smallPizza;
            document.getElementById('largePizza').value = data.largePizza;
            document.getElementById('pizzaDeliveredCount').value = data.pizzaDeliveredCount;
            document.getElementById('pizzaLeftCount').value = data.pizzaLeftCount;
            
            // Open the modal for editing
            openStockModal();
        }
    };
};

// Fetch and display all stock items in the table
const displayStock = async () => {
    const db = await openDatabase();
    const transaction = db.transaction('inventory', 'readonly');
    const store = transaction.objectStore('inventory');
    const tableBody = document.getElementById('stockTableBody');

    // Clear any existing rows in the table body
    tableBody.innerHTML = '';

    store.openCursor().onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
            const stock = cursor.value;
            const row = document.createElement('tr');

            // Create table cells for each property
            row.innerHTML = `
                <td>${stock.jour}</td>
                <td>${stock.smallPizza}</td>
                <td>${stock.largePizza}</td>
                <td>${stock.pizzaDeliveredCount}</td>
                <td>${stock.pizzaLeftCount}</td>
                <td>
                    <button onclick="editStock(${stock.id})">Edit</button>
                    <button onclick="deleteStock(${stock.id})">Delete</button>
                </td>
            `;

            // Append the row to the table body
            tableBody.appendChild(row);

            cursor.continue();
        } else {
            console.log('All stock displayed.');
        }
    };
};

// Call displayStock on page load
document.addEventListener('DOMContentLoaded', displayStock);

