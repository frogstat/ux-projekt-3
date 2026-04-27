import { createApp, ref, onMounted } from "vue";

const body = document.getElementsByTagName('body')[0];

const app = {
    data() {
        return {
            startDate: new Date("2026-03-30"),
            selectedJob: "all-jobs"
        }
    },

    computed: {
        days() {
            return Array.from({ length: 28 }, (_, i) => {
                const d = new Date(this.startDate);
                d.setDate(this.startDate.getDate() + i);
                return d;
            });
        },

        weeks() {
            const weeks = [];

            for (let i = 0; i < this.days.length; i += 7) {
                weeks.push(this.days.slice(i, i + 7));
            }

            return weeks;
        },

        filteredEmployees() {
            if (this.selectedJob === "all-jobs") {
                return this.jsonResults;
            }

            return this.jsonResults.filter(emp =>
                emp.professions.includes(this.selectedJob)
            );
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
            let backgroundColor = "#E4E4E4";

            for (const booking of result.bookings) {
                const from = new Date(booking.from);
                const to = new Date(booking.to);

                if (currentDay >= from && currentDay <= to) {
                    if(booking.status === "Preliminary"){
                        backgroundColor = "#FFE59D";
                    } else if (booking.status === "Booked"){
                        backgroundColor = "#FFA1A1";
                    } else if (booking.status === "Absent"){
                        backgroundColor = "#A949BB"
                    }
                    break;
                }
            }

            //CSS style
            return "background-color: " + backgroundColor;
        },

        getPercentage(result, currentDay) {
            let numOfMatches = 0;
            let outputString = "";

            for (const booking of result.bookings) {
                const from = new Date(booking.from);
                const to = new Date(booking.to);

                if (currentDay >= from && currentDay <= to) {
                    numOfMatches ++;
                    outputString = booking.percentage + "%";
                }
            }
            if(numOfMatches === 2){
                outputString = "2x 50%"
            }
            return outputString;

        },

        parseDayOfWeek(day) {
            const days = [
                "Sun",
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat"
            ];

            return days[day] ?? "";
        },

        getWeekNumber(date) {
            const d = new Date(date);
            d.setHours(0, 0, 0, 0);

            // ISO week logic
            d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
            const week1 = new Date(d.getFullYear(), 0, 4);

            return 1 + Math.round(
                ((d - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7
            );
        }
    }
}

createApp(app).mount("#app")