document.addEventListener("DOMContentLoaded", () => {
    // Initialize Supabase
    const supabaseUrl = 'https://tgwdhdascgmwyjorevyf.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnd2RoZGFzY2dtd3lqb3JldnlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAwNzg1MjcsImV4cCI6MjA0NTY1NDUyN30.Dn04vhFonpePpuXsjRohDpJn6m55c_gMdtfAT0-ADWI';

    const { createClient } = supabase;  // Destructure createClient from supabase
    const supabaseClient = createClient(supabaseUrl, supabaseKey)

    // Fetch data function
    async function fetchOrders() {
        try {
            let { data, error } = await supabaseClient
                .from('orders')
                .select('*');

            if (error) throw error;

            const tableBody = document.getElementById('tableBody');
            tableBody.innerHTML = '';  // Clear existing data

            data.forEach(order => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${order.delivery_adress}</td>
                    <td>${order.type_pizza}</td>
                    <td>${order.delivery_hour}</td>
                    <td>${order.assigned_deliveryman}</td>
                    <td>${order.create_at}</td>
                    <td>${order.update_at}</td>
                    <td>${order.id_livreur}</td>
                `;
                tableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    }

    // Call fetchOrders to populate the table
    fetchOrders();
});


function formatDate(date) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    function formatOrdinal(day) {
        const suffixes = ["th", "st", "nd", "rd"];
        const value = day % 100;
        return day + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0]);
    }

    function displayDateAndTime() {
        const now = new Date();
        const day = formatOrdinal(now.getDate());
        const month = now.toLocaleString('default', { month: 'long' });
        const year = now.getFullYear();
        const weekday = now.toLocaleString('default', { weekday: 'long' });

        const formattedDate = `${weekday}, ${day} of ${month} ${year}`;
        const formattedTime = now.toLocaleTimeString();

        // Combine date and time
        const output = `${formattedDate}<br>Current Time: ${formattedTime}`;

        // Display in the HTML element
        document.getElementById('date-time').innerHTML = output;
    }

    // Call the function to display the date and time
    displayDateAndTime();
