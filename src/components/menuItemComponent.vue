<script setup>
import { FontAwesomeIcon,  } from '@fortawesome/vue-fontawesome';
import { faSeedling, faCarrot, faBreadSlice, faDumbbell} from '@fortawesome/free-solid-svg-icons';

import { ref } from 'vue';
const props = defineProps({
    menuItem: {
        type: Object,
        required: true
    }
});
// Modal visibility state
const showModal = ref(false);

// Function to toggle modal
const toggleModal = () => {
    showModal.value = !showModal.value;
};
</script>
<template>
    <div class="card menu-item" @click="toggleModal">
        <div class="card-body">
            <h5 class="card-title">{{ menuItem.name }}</h5>
            <p class="card-text">{{ menuItem.description }}</p>
            <div class="d-flex gap-2">
                <span class="text-muted">
                    {{ menuItem.calories }} Calories
                </span>
                <span v-if="menuItem.labels.length > 0" class="d-flex align-items-center gap-2">
                    <FontAwesomeIcon 
                        v-if="menuItem.labels.includes('Vegetarian')"
                        :icon="faSeedling"
                        class="text-success"
                        title="Vegetarian"
                    />
                    <FontAwesomeIcon
                        v-if="menuItem.labels.includes('Vegan')"
                        :icon="faCarrot"
                        class="text-success"
                        title="Vegan"
                    />
                    <span
                        v-if="menuItem.labels.includes('Avoiding Gluten')"
                        class="text-success"
                        title="Gluten Free"
                        >
                        GF
                    </span>
                    <FontAwesomeIcon
                        v-if="menuItem.labels.includes('Good Source of Protein')"
                        :icon="faDumbbell"
                        class="text-success"
                        title="Good Source of Protein"
                    />
                </span>
            </div>
        </div>
    </div>

    <div v-if="showModal" class="modal d-block" tabindex="-1" style="background-color: rgba(0, 0, 0, 0.5)" @click.self="toggleModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">{{ menuItem.name }}</h5>
                    <button type="button" class="btn-close" aria-label="Close" @click="toggleModal"></button>
                </div>
                <div class="modal-body">
                    <p>{{ menuItem.description }}</p>
                    <p>Serving size: {{ menuItem.portion }}</p>
                    <div v-if="menuItem.labels.length > 0" class="col d-flex flex-column gap-2 mb-1">
                        <span v-if="menuItem.labels.includes('Vegetarian')">
                            <FontAwesomeIcon 
                                :icon="faSeedling"
                                class="text-success"
                                title="Vegetarian"
                            />
                            - Vegetarian
                        </span>
                        <span v-if="menuItem.labels.includes('Vegan')">
                            <FontAwesomeIcon
                                :icon="faCarrot"
                                class="text-success"
                                title="Vegan"
                            />
                            - Vegan
                        </span>
                        <span v-if="menuItem.labels.includes('Avoiding Gluten')">
                            <span
                                class="text-success"
                                title="Gluten Free"
                                >
                                GF
                            </span>
                            - Gluten Free
                        </span>
                        <span v-if="menuItem.labels.includes('Good Source of Protein')">
                            <FontAwesomeIcon
                                :icon="faDumbbell"
                                class="text-success"
                                title="Good Source of Protein"
                            />
                            - Good Source of Protein
                        </span>
                    </div>
                    <div class="accordion" id="nutritionAccordion">
                        <div class="accordion-item">
                            <h2 class="accordion-header" id="headingOne">
                                <button 
                                class="accordion-button" 
                                type="button" 
                                data-bs-toggle="collapse" 
                                data-bs-target="#collapseOne" 
                                aria-expanded="false" 
                                aria-controls="collapseOne">
                                Nutrition Information
                                </button>
                            </h2>
                            <div 
                                id="collapseOne" 
                                class="accordion-collapse collapse" 
                                aria-labelledby="headingOne" 
                                data-bs-parent="#nutritionAccordion">
                                <div class="accordion-body">
                                    <ul>
                                        <li v-for="(nutrient, index) in menuItem.nutrients" :key="index">
                                            {{ nutrient.name }}: {{ nutrient.value }}
                                            <span v-if="nutrient.value !== 'less than 1 gram'">{{ nutrient.uom }}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-body">
                    <div class="accordion" id="IngredientsAccordion">
                        <div class="accordion-item">
                            <h2 class="accordion-header" id="headingTwo">
                                <button 
                                class="accordion-button" 
                                type="button" 
                                data-bs-toggle="collapse" 
                                data-bs-target="#collapseTwo" 
                                aria-expanded="false" 
                                aria-controls="collapseTwo">
                                Ingredients
                                </button>
                            </h2>
                            <div 
                                id="collapseTwo" 
                                class="accordion-collapse collapse" 
                                aria-labelledby="headingTwo" 
                                data-bs-parent="#IngredientsAccordion">
                                <div class="accordion-body">
                                    <ul>
                                        <li v-for="ingredient in menuItem.ingredients" :key="ingredient">
                                            {{ ingredient }}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-body">
                    <div class="accordion" id="AllergensAccordion">
                        <div class="accordion-item">
                            <h2 class="accordion-header" id="headingThree">
                                <button 
                                class="accordion-button" 
                                type="button" 
                                data-bs-toggle="collapse" 
                                data-bs-target="#collapseThree" 
                                aria-expanded="false" 
                                aria-controls="collapseThree">
                                Allergens
                                </button>
                            </h2>
                            <div 
                                id="collapseThree" 
                                class="accordion-collapse collapse" 
                                aria-labelledby="headingThree" 
                                data-bs-parent="#AllergensAccordion">
                                <div class="accordion-body">
                                    <ul>
                                        <li v-for="allergen in menuItem.allergens" :key="allergen">
                                            {{ allergen }}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>                
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="toggleModal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>
