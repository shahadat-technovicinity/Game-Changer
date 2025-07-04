import {
    Additional, IAdditional
} from "./model";
import { AppError } from "../utils/appError";

// Fetch Page by Type (Privacy Policy, Terms & Conditions, FAQ)
const getAdditionalByTypeService = async (type: string): Promise<IAdditional> => {
    const page = await Additional.findOne({ type });
    if (!page) {
        throw new AppError("Pagina non trovata", 404);
    }
    return page;
}

// Create or Update Page Content with multiple objects in body
const createAdditionalByTypeService =    async(type: string, body: { title: string, content: string }[]): Promise<IAdditional> => {
    const page = await Additional.findOne({ type });
    if (!page) {
        // Create new page
        return await Additional.create({ type, body });
    }
    // Update existing page
    page.body = body;
    await page.save();
    return page;
} 

// Delete Page by Type
const deleteAdditionalByTypeService = async (type: string): Promise<void> => {
    const page = await Additional.findOne({ type});
    if (!page) {
        throw new AppError("Pagina non trovata", 404);
    }
    await Additional.deleteOne({ type });
    return;
};

const updateAdditionalByIdService = async (type: string, id: string, title: string, content: string): Promise<IAdditional> => {
    const page = await Additional.findOneAndUpdate(
        { type, "body._id": id }, // Find the document with matching type and nested _id
        { 
          $set: { 
            "body.$.title": title,
            "body.$.content": content
          } 
        },
        { new: true } // Return updated document
      );

    if (!page) {
        throw new AppError("Pagina non trovata", 404);
    }

    await page.save();
    return page;
}


// Delete Page by FAQ Type and inside seperate object
const deleteAdditionalByIdService = async (type: string, id: string): Promise<void> => {
    const page = await Additional.findOne({ type, "body._id": id });
    if (!page) {
        throw new AppError("Pagina non trovata", 404);
    }

    await Additional.findOneAndUpdate(
        { type },
        { $pull: { body: { _id: id } } }, // Remove the specific FAQ entry by _id
        { new: true } // Return the updated document
    );
    return;
}

// Get Page by FAQ Type and inside seperate object
const getAdditionalByIdService = async (type: string, id: string): Promise<IAdditional> => {
    const page = await Additional.findOne(
        { type, "body._id": id }, 
        { "body.$": 1 } // This will return only the matched object inside `body`
    );

    if (!page) {
        throw new AppError("Voce FAQ non trovata", 404);
    }
    return page; // Return only the specific FAQ object
}

export { getAdditionalByTypeService,createAdditionalByTypeService,deleteAdditionalByTypeService,updateAdditionalByIdService,deleteAdditionalByIdService,getAdditionalByIdService };
