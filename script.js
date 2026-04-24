import { createApp, ref, onMounted } from "vue";

const body = document.getElementsByTagName('body')[0];

const app = {
    data() {
        const startDate = new Date("2026-03-30");
        return {
            days: Array.from({ length: 28 }, (_, i) => {
                const d = new Date(startDate);
                d.setDate(startDate.getDate() + i);
                return d;
            })
        }
    },

    computed: {
        days() {
            return Array.from({ length: 28 }, (_, i) => {
                const d = new Date(this.startDate);
                d.setDate(this.startDate.getDate() + i);
                return d;
            });
        }
    },

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

        async function createListOfResults() {
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
            createListOfResults();
        });


        return { jsonResults };
    },

    methods: {
        next28Days() {
            const newDate = new Date(this.startDate);
            newDate.setDate(newDate.getDate() + 28);
            this.startDate = newDate;
        },

        previous28Days() {
            const newDate = new Date(this.startDate);
            newDate.setDate(newDate.getDate() - 28);
            this.startDate = newDate;
        },

        setBookingStyle(result, currentDay) {
            let backgroundColor = "grey";

            for (const booking of result.bookings) {
                const from = new Date(booking.from);
                const to = new Date(booking.to);

                if (currentDay >= from && currentDay <= to) {
                    backgroundColor = booking.status === "Preliminary" ? "yellow" : "red";
                    break;
                }
            }

            //CSS style
            return "background-color: " + backgroundColor;
        }
    }
}

createApp(app).mount("#app")