import { createApp, ref, onMounted } from "vue";

const body = document.getElementsByTagName('body')[0];

const app = {
    setup() {
        const jsonResults = ref([]);

        async function fetchEmployees() {
            let response = await fetch("https://yrgo-web-services.netlify.app/bookings");

            if (!response.ok) {
                throw new Error("Error: " + response.status);
            }

            const data = await response.json();

            return data;
        }

        async function createListOfNames() {
            fetchEmployees().then(results => {

                if (results.length === 0) {
                    console.log("No results found")
                }
                else {
                    jsonResults.value = results;
                }

            });
        }

        onMounted(() => {
            createListOfNames();
        });

        return { jsonResults };
    }
}

createApp(app).mount("#app")