document.addEventListener("DOMContentLoaded", function() {
    
    // তারিখ আপডেট
    const dateEl = document.getElementById("current-date");
    if(dateEl) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateEl.textContent = new Date().toLocaleDateString("en-US", options);
    }

    const newsContainer = document.getElementById('dynamic-news-container');

    // আপনার দেওয়া গুগল শিটের লিঙ্ক
    const sheetURL = 'https://docs.google.com/spreadsheets/d/1vFu3aFatR3aGXFj6qDu2tTu7p_8w3EsA3OihJTXyMco/export?format=csv';

    async function fetchNews() {
        try {
            const response = await fetch(sheetURL);
            const data = await response.text();
            
            // CSV ডাটা থেকে লাইনগুলো আলাদা করা (প্রথম লাইন বাদ দিয়ে)
            const rows = data.split('\n').slice(1); 
            let htmlContent = '';

            rows.forEach(row => {
                // কমা দিয়ে ডাটা আলাদা করার লজিক (উন্নত পদ্ধতি)
                const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
                
                if(cols.length >= 4) {
                    const category = cols[0].replace(/"/g, "").trim();
                    const title = cols[1].replace(/"/g, "").trim();
                    const image = cols[2].replace(/"/g, "").trim();
                    const desc = cols[3].replace(/"/g, "").trim();

                    if(title !== "") {
                        htmlContent += `
                            <article class="news-card">
                                <div class="card-img" style="background-image: url('${image}');"></div>
                                <div class="card-body">
                                    <span class="badge">${category}</span>
                                    <h3>${title}</h3>
                                    <p>${desc}</p>
                                </div>
                                <div class="card-footer">Global Updates • Live Feed</div>
                            </article>`;
                    }
                }
            });

            if(htmlContent === '') {
                newsContainer.innerHTML = `<p style="text-align:center; color:#555; grid-column:1/-1;">No news found. Please add news to your Google Sheet.</p>`;
            } else {
                newsContainer.innerHTML = htmlContent;
            }

        } catch (error) {
            newsContainer.innerHTML = `<p style="text-align:center; color:#555; grid-column:1/-1;">Check your internet or Google Sheet sharing settings.</p>`;
        }
    }

    fetchNews();
});
