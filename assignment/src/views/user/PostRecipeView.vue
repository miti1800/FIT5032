<template>
    <div v-if="loading" class="text-center p-5 loader-overlay">
        <span class="spinner-border me-2" role="status"></span>
        <p class="mt-2">Loading...</p>
    </div>

    <div class="px-4 pt-3 m-2 primary-color">
        <div class="d-flex align-items-center fw-lighter">User > &nbsp;
            <p class="fw-normal text-decoration-underline mb-0">Post Recipe</p>
        </div>
    </div>

    <div class="container-fluid p-4 py-2 primary-color">
        <div class="row justify-content-center">
            <div class="col-12 px-3">
                <div class="card shadow-sm">
                    <div class="card-body">
                        <form @submit.prevent="handleSubmit">
                        <div class="mb-3">
                            <label for="recipe_name" class="form-label fw-bold">Recipe Name <span class="error-color">*</span></label>
                            <input
                                type="text"
                                class="form-control"
                                id="recipe_name"
                                v-model="formData.recipe_name"
                                placeholder="Enter recipe name"
                                @blur="() => validateRecipeName(true)"
                                @input="() => validateRecipeName(false)"
                                :class="{
                                    invalid: errors.recipe_name != null
                                }"
                            />

                            <div v-if="errors.recipe_name" class="error-box py-1 px-2 my-1 small d-flex align-items-center">
                                <i class="bi bi-exclamation-circle error-color fs-6 me-2"></i>
                                {{ errors.recipe_name }}
                            </div>
                        </div>

                        <div class="mb-3">
                            <div class="mb-3">
                                <label for="fileInput" class="form-label">Choose Image <span class="error-color">*</span></label>
                                <div class="d-flex align-items-center">
                                    <input
                                        id="fileInput"
                                        type="file"
                                        class="form-control me-3"
                                        accept="image/*"
                                        @change="handleFileSelect"
                                        ref="fileInput"
                                    />
                                    <button
                                        type="button"
                                        class="btn secondary-btn px-4"
                                        :disabled="!selectedFile"
                                        @click="clearSelection"
                                    >
                                        Clear
                                    </button>
                                </div>
                                <div class="form-text">Supported formats: JPG, PNG, GIF, WebP</div>
                                <div v-if="errors.image" class="error-box py-1 px-2 my-1 small d-flex align-items-center">
                                    <i class="bi bi-exclamation-circle error-color fs-6 me-2"></i>
                                    {{ errors.image }}
                                </div>
                            </div>

                            <div v-if="preview" class="mb-3">
                                <label class="form-label">Preview</label>
                                <div class="text-center">
                                    <img :src="preview" alt="Preview" class="img-thumbnail" style="max-height: 300px" />
                                </div>
                                <div class="mt-2">
                                    <small>{{ fileInfo }}</small>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-4 mb-3">
                                <label for="prep_time" class="form-label fw-bold">Prep Time (in minutes) <span class="error-color">*</span></label>
                                <input
                                    type="number"
                                    class="form-control"
                                    id="prep_time"
                                    v-model="formData.prep_time"
                                    placeholder="e.g., 15"
                                    @blur="() => validateTime(true, 'prep_time')"
                                    @input="() => validateTime(false, 'prep_time')"
                                    :class="{
                                        invalid: errors.prep_time != null
                                    }"
                                />
                                <div v-if="errors.prep_time" class="error-box py-1 px-2 my-1 small d-flex align-items-center">
                                    <i class="bi bi-exclamation-circle error-color fs-6 me-2"></i>
                                    {{ errors.prep_time }}
                                </div>
                            </div>

                            <div class="col-md-4 mb-3">
                                <label for="cook_time" class="form-label fw-bold">Cook Time (in minutes) <span class="error-color">*</span></label>
                                <input
                                    type="number"
                                    class="form-control"
                                    id="cook_time"
                                    v-model="formData.cook_time"
                                    placeholder="e.g., 30"
                                    @blur="() => validateTime(true, 'cook_time')"
                                    @input="() => validateTime(false, 'cook_time')"
                                    :class="{
                                        invalid: errors.cook_time != null
                                    }"
                                />
                                <div v-if="errors.cook_time" class="error-box py-1 px-2 my-1 small d-flex align-items-center">
                                    <i class="bi bi-exclamation-circle error-color fs-6 me-2"></i>
                                    {{ errors.cook_time }}
                                </div>
                            </div>

                            <div class="col-md-4 mb-3">
                                <label for="servings" class="form-label fw-bold">Servings <span class="error-color">*</span></label>
                                <input
                                    type="number"
                                    class="form-control"
                                    id="servings"
                                    v-model="formData.servings"
                                    placeholder="e.g., 4"
                                    min="1"
                                    @blur="() => validateServings(true)"
                                    @input="() => validateServings(false)"
                                    :class="{
                                        invalid: errors.servings != null
                                    }"
                                />
                                <div v-if="errors.servings" class="error-box py-1 px-2 my-1 small d-flex align-items-center">
                                    <i class="bi bi-exclamation-circle error-color fs-6 me-2"></i>
                                    {{ errors.servings }}
                                </div>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label fw-bold">Ingredients <span class="error-color">*</span></label>
                                <div v-for="(ingredient, index) in formData.ingredients" :key="index" class="mb-2">
                                <div class="input-group">
                                    <span class="input-group-text">{{ index + 1 }}</span>
                                    <input
                                        type="text"
                                        class="form-control"
                                        v-model="formData.ingredients[index]"
                                        placeholder="Enter ingredient"
                                        @blur="() => validateIngredient(true)"
                                        @input="() => validateIngredient(false)"
                                        :class="{
                                            invalid: errors.ingredients != null && index === formData.ingredients.length - 1
                                        }"
                                    />
                                    <button
                                        type="button"
                                        class="btn secondary-btn d-flex align-items-center"
                                        @click="removeIngredient(index)"
                                        :disabled="formData.ingredients.length === 1"
                                    >
                                        <i class="bi bi-trash-fill me-1"></i> Remove
                                    </button>
                                </div>
                            </div>
                            <div v-if="errors.ingredients" class="error-box py-1 px-2 my-1 small d-flex align-items-center">
                                <i class="bi bi-exclamation-circle error-color fs-6 me-2"></i>
                                {{ errors.ingredients }}
                            </div>
                            <button type="button" class="btn primary-btn btn-sm mt-1" @click="addIngredient">
                                + Add Ingredient
                            </button>
                        </div>

                        <div class="mb-4">
                            <label class="form-label fw-bold">Instructions <span class="error-color">*</span></label>
                            <div v-for="(instruction, index) in formData.instructions" :key="index" class="mb-2">
                                <div class="input-group">
                                    <span class="input-group-text">Step {{ index + 1 }}</span>
                                    <textarea
                                        class="form-control"
                                        v-model="formData.instructions[index]"
                                        placeholder="Enter instruction step"
                                        rows="2"
                                        @blur="() => validateInstruction(true)"
                                        @input="() => validateInstruction(false)"
                                        :class="{
                                            invalid: errors.instructions != null && index == formData.instructions.length-1
                                        }"
                                    ></textarea>
                                    <button
                                        type="button"
                                        class="btn secondary-btn"
                                        @click="removeInstruction(index)"
                                        :disabled="formData.instructions.length === 1"
                                    >
                                    <i class="bi bi-trash-fill"></i> Remove
                                    </button>
                                </div>
                            </div>

                            <div v-if="errors.instructions" class="error-box py-1 px-2 my-1 small d-flex align-items-center">
                                <i class="bi bi-exclamation-circle error-color fs-6 me-2"></i>
                                {{ errors.instructions }}
                            </div>
                            <button type="button" class="btn primary-btn btn-sm mt-1" @click="addInstruction">
                                + Add Instruction
                            </button>
                        </div>

                        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                            <button type="button" class="btn primary-btn" @click="resetForm">
                                Reset
                            </button>
                            <button type="submit" class="btn primary-btn">
                                Submit Recipe
                            </button>
                        </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/user';
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getApp } from "firebase/app";
import { useToast } from 'primevue/usetoast';
import router from '@/router';

const userStore = useUserStore();
const toast = useToast();

const db = getFirestore(getApp());

const formData = ref({
    recipe_name: '',
    prep_time: null,
    cook_time: null,
    servings: null,
    ingredients: [''],
    instructions: ['']
});

const errors = ref({
    recipe_name: null,
    image: null,
    prep_time: null,
    cook_time: null,
    servings: null,
    ingredients: null,
    instructions: null
});

const fileInput = ref(null)
const selectedFile = ref(null)
const preview = ref(null)
const uploading = ref(false)

const loading = ref(false);

const addIngredient = () => {
    validateIngredient(true);
    if(!errors.value.ingredients) {
        formData.value.ingredients.push('');
    }
};

const removeIngredient = (index) => {
    if (formData.value.ingredients.length > 1) {
        formData.value.ingredients.splice(index, 1);
        validateIngredient(true);
    }
};

const addInstruction = () => {
    validateInstruction(true);
    if(!errors.value.instructions) {
        formData.value.instructions.push('');
    }
};

const removeInstruction = (index) => {
    if (formData.value.instructions.length > 1) {
        formData.value.instructions.splice(index, 1);
        validateInstruction(true);
    }
};

const validateRecipeName = (blur) => {
    const hasOnlyAlphabets = /^[A-Za-z' ]+$/.test(formData.value.recipe_name.trim());
    if (formData.value.recipe_name.length < 3) {
        if(blur) errors.value.recipe_name = "Recipe name must be atleast 3 characters.";
    }
    else if (!hasOnlyAlphabets) {
        if(blur) errors.value.recipe_name = "Recipe name must only contain alphabets.";
    }
    else {
        errors.value.recipe_name = null;
    }
};

const validateTime = (blur, fieldName) => {
  const value = formData.value[fieldName];

  if (value === null || value === '' || isNaN(value)) {
    if (blur) errors.value[fieldName] = `${fieldName=='prep_time' ? "Prep time" : "Cook time"} is required.`;
  } else if (value < 0) {
    if (blur) errors.value[fieldName] = `${fieldName=='prep_time' ? "Prep time" : "Cook time"} must be greater than or equal to 0.`;
  } else if (value > 120) {
    if (blur) errors.value[fieldName] = `${fieldName=='prep_time' ? "Prep time" : "Cook time"} cannot exceed 120 minutes.`;
  } else {
    errors.value[fieldName] = null;
  }
};

const validateServings = (blur) => {
  const value = formData.value.servings;

  if (value === null || value === '' || isNaN(value)) {
    if (blur) errors.value.servings = "Servings is required.";
  } else if (value < 1) {
    if (blur) errors.value.servings = "Servings must be atleast 1.";
  } else if (value > 50) {
    if (blur) errors.value.servings = "Servings cannot exceed 50.";
  } else {
    errors.value.servings = null;
  }
};

const validateIngredient = (blur) => {
  const ingredients = formData.value.ingredients;

  if (!ingredients || ingredients.length === 0) {
    if (blur) errors.value.ingredients = "Please add at least one ingredient.";
    return;
  }

  for (let i = 0; i < ingredients.length; i++) {
    if (!ingredients[i]) {
      if (blur) errors.value.ingredients = `Ingredient ${i + 1} is empty.`;
      return;
    }

    if(ingredients[i].trim().length < 2) {
        if (blur) errors.value.ingredients = `Ingredient ${i + 1} is too short.`;
        return;
    }
  }

  errors.value.ingredients = null;
};


const validateInstruction = (blur) => {
  const instructions = formData.value.instructions;

  if (!instructions || instructions.length === 0) {
    if (blur) errors.value.instructions = "Please add at least one instruction.";
    return;
  }

  for (let i = 0; i < instructions.length; i++) {
    if (!instructions[i]) {
      if (blur) errors.value.instructions = `Instruction ${i + 1} is empty.`;
      return;
    }

    if(instructions[i].trim().length < 10) {
        if (blur) errors.value.instructions = `Instruction ${i + 1} is too short, it should atleast be 10 characters long.`;
        return;
    }
  }

  errors.value.instructions = null;
};

const fileInfo = computed(() => {
  if (!selectedFile.value) return ''
  const size = (selectedFile.value.size / 1024).toFixed(2)
  return `${selectedFile.value.name} (${size} KB)`
})

const handleFileSelect = (event) => {
  const target = event.target
  const file = target.files?.[0]

  if (!file) {
    errors.value.image = "Image is required!";
    return;
  }

  if (!file.type.startsWith('image/')) {
    errors.value.image = "Please upload a valid image file";
    return
  }

  selectedFile.value = file;
  errors.value.image = null;

  const reader = new FileReader()
  reader.onload = (e) => {
    preview.value = e.target?.result
  }
  reader.readAsDataURL(file)
};

const validateImage = () => {
    if (!selectedFile.value) {
        errors.value.image = "Image is required!";
    } else if (!selectedFile.value.type.startsWith('image/')) {
        errors.value.image = "Please upload a valid image file";
    } else {
        errors.value.image = null;
    }
};

const clearSelection = () => {
  selectedFile.value = null
  preview.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
};

const handleSubmit = async () => {
    validateRecipeName(true);
    validateTime(true, 'prep_time');
    validateTime(true, 'cook_time');
    validateServings(true);
    validateIngredient(true);
    validateInstruction(true);
    validateImage();

    if(!errors.value.recipe_name && !errors.value.cook_time && !errors.value.prep_time
        && !errors.value.image && !errors.value.servings && !errors.value.ingredients && !errors.value.instructions
    ) {
        loading.value = true;
        const image = await uploadImageToCloudFunction();
        if (!image) {
            loading.value = false;
            toast.add({
                severity: "error",
                summary: "Error",
                detail: "Failed to upload image! Please try again !!",
                life: 5000,
            });
            return;
        }
        console.log(image, "Imagesss");

        const nutrition = await getNutritionData(formData.value.ingredients, formData.value.instructions);

        if (nutrition) {
            console.log("Nutrition info:", nutrition);
        } else {
            loading.value = false;
            toast.add({
                severity: "error",
                summary: "Error",
                detail: "AI failed to analyse nutrition data for your recipe.",
                life: 5000,
            });
        }

        const obj = {
            author_id: userStore.currentUser.id,
            author_name: userStore.currentUser.firstName + ' ' + userStore.currentUser.lastName,
            cook_time: formData.value.cook_time,
            cuisine_path: nutrition.category,
            directions: formData.value.instructions,
            image,
            ingredients: formData.value.ingredients,
            liked_by: [],
            nutrition,
            posted_on: new Date(),
            prep_time: formData.value.prep_time,
            rating: [],
            recipe_name: formData.value.recipe_name,
            saved_by: [],
            servings: formData.value.servings,
            total_time: Number(formData.value.cook_time) + Number(formData.value.prep_time),
            user_id: []
        }

        try {
            const docRef = await addDoc(collection(db, "recipes"), {
                ...obj,
                posted_on: serverTimestamp()
            });
            console.log("Recipe added with ID:", docRef.id);
            toast.add({
                severity: "success",
                summary: "Success",
                detail: "Recipe added successfully!",
                life: 5000,
            });

            resetForm();
            loading.value = false;
            router.push({ name: 'RecipeDetailView', params: { id: docRef.id } });
        } catch (error) {
            loading.value = false;
            toast.add({
                severity: "error",
                summary: "Error",
                detail: "Failed to add your recipe.",
                life: 5000,
            });
            console.error("Error adding recipe:", error);
        }
    }
};

const resetForm = () => {
    formData.value = {
        recipe_name: '',
        prep_time: null,
        cook_time: null,
        servings: null,
        ingredients: [],
        instructions: []
    };
};

const uploadImageToCloudFunction = async () => {
  if (!selectedFile.value) return null;

  const formData = new FormData();
  formData.append("file", selectedFile.value);

  try {
    uploading.value = true;
    const response = await fetch("https://uploadimage-wudmf24boa-uc.a.run.app", {
      method: "POST",
      body: formData
    });

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error("Upload failed:", error);
    return null;
  } finally {
    uploading.value = false;
  }
};

const getNutritionData = async (ingredients, instructions) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + apiKey;

  const promptText = `
You are a nutrition expert. Given the following recipe:

Ingredients:
${ingredients.join("\n")}

Instructions:
${instructions.join("\n")}

Return ONLY a JSON object with:
{
  "calories": number,
  "carbs": "10g",
  "fat": "20g",
  "fiber": "4g",
  "protein": "35g",
  "category": "Breakfast"|"Lunch"|"Dinner"
}
`;

  const requestPayload = {
    contents: [
      {
        role: "user",
        parts: [{ text: promptText }]
      }
    ]
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload)
    });

    const result = await response.json();

    const responseText = result.candidates[0].content.parts[0].text;
    const cleanResponse = responseText.replace(/^```json\n|\n```$/g, '').trim();
    const nutritionData = JSON.parse(cleanResponse);

    console.log('Parsed Nutrition Data:', nutritionData);
    return nutritionData;
  } catch (error) {
    console.error('Error fetching data from Gemini API:', error);
  }
};

</script>

<style scoped>
.card {
  border-radius: 8px;
}

.card-header {
  border-radius: 8px 8px 0 0;
  padding: 1.5rem;
}

.form-label {
  color: #2c3e50;
}

.input-group-text {
  background-color: #f8f9fa;
  font-weight: 600;
}

textarea {
  resize: vertical;
}
</style>