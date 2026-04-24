import { createApp, ref, onMounted } from "vue";

const body = document.getElementsByTagName('body')[0];

const app = {
    data(){
        return{
            baseStart: parseDate("2026-03-30")
        }
    },

    computed: {
        visibleDays() {
          return Array.from({ length: 28 }, (_, i) =>
            addDays(this.baseStart, i)
          );
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

        function barStyle(job) {
            const from = job.from;
            const to = job.to;
            const height = job.percentage === 100 ? 2 : 1;
            const diffDays = getDateDiff(from, to);

            console.log("From: " + from + ". To: " + to);
            console.log(diffDays);
            return {
                height: height
            }
        }

        function getDateDiff(from, to) {
            const fromDate = new Date(from);
            const toDate = new Date(to);

            const diffDate = toDate - fromDate;
            const diffDays = Math.ceil(diffDate / (1000 * 60 * 60 * 24));

            return diffDays;
        }

        function visibleProjects(job) {
            
            return
        }

        onMounted(() => {
            createListOfNames();
        });


        return { jsonResults, barStyle };
    }
}.mount("#app")}