export const pentaLink = {
    props: [
        'img',
        'link',
        'desc'
    ],
    data() {
        return {
            tilt: () => {
                let number = Math.floor(Math.random() * (60 - 15)) + 15;
                if (Math.random() < 0.5) {
                    number *= -1;
                }
                return `transform: rotate(${number}deg)`;
            }
        }
    },
    template: `
        <a 
            class="pentaLink" 
            :href=link 
            data-toggle="tooltip" 
            data-placement="top" 
            data-delay="{ &quot;show&quot;: 500, &quot;hide&quot;: 100 }" 
            title="" 
            :data-original-title=desc
        >
            <svg 
                viewBox="0 0 58 64" 
                class="pL__bg" 
                style="transform: rotate(-22deg);"
            >
                <polygon points="46.954,57.792 11,57.792 -1,24.544 29.039,0.208 59,24.792"></polygon>
            </svg>
            <img 
                class="pL__fg"
                :src=img
                :style=tilt
                :alt=desc
            >
        </a>
    `
};