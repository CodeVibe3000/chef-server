import * as express from "express"
import * as multer from "multer";
import { v4 as uuidv4 } from 'uuid';
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 } from 'cloudinary'
import { RecipeService } from "../services/recipe.service";

v2.config({ 
    cloud_name: 'bob3000', 
    api_key: '454368878945362', 
    api_secret: 'I_H7-SpYkwKgNKlz98jsyN-iQ08' 
  });


const storage = new CloudinaryStorage({
    cloudinary: v2,
    params: {
      folder: 'recipeImages',
      format: async (_, __) => 'png', // supports promises as well
      public_id: (_, __) => uuidv4(),
    },
  }) as any

const upload = multer({ storage })

export var router = express.Router()

router.post('/uploadRecipeImage', upload.single('image'), RecipeService.addImageToRecipe)

