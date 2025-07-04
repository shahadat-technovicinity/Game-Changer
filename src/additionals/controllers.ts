import { Request, Response } from "express";
import {
    getAdditionalByTypeService,
    createAdditionalByTypeService,
    deleteAdditionalByTypeService,
    updateAdditionalByIdService,
    deleteAdditionalByIdService,
    getAdditionalByIdService
} from "./services";
import { AppError } from "../utils/appError";
import { catchAsync } from "../utils/catchAsync";


const getAdditionalByType =  catchAsync(async (req: Request, res: Response) => {
    const { type } = req.params;
    // Validate type
    if (!["privacy_policy", "terms_conditions", "faq"].includes(type)) {
        throw new AppError("Tipo non valido", 400);
    }

    const page = await getAdditionalByTypeService(type);
    res.json({ message:"Informazioni recuperate con successo", page });
    
});

const createAdditionalByType = catchAsync(async (req: Request, res: Response) => {
    const { type } = req.params;
    const { body } = req.body; // Expecting an array of objects [{title, content}, {title, content}]

    if (!Array.isArray(body) || body.length === 0) {
        throw new AppError("Corpo non valido", 400);
    }
    
    const page = await createAdditionalByTypeService(type, body);
    res.json({ message: "Informazioni create con successo", page });
  
  });

const deleteAdditionalByType = catchAsync(async (req: Request, res: Response) => {
    const { type } = req.params;
    if(!["privacy_policy", "terms_conditions", "faq"].includes(type)){
        throw new AppError("Tipo non valido", 400);
    }
    await deleteAdditionalByTypeService(type);
    res.json({ message: "Informazioni eliminate con successo"});
});

const updateAdditionalById = catchAsync(async (req: Request, res: Response) => {
    const { type, id } = req.params;
    const { title, content } = req.body;
    // Validate type
    if (!["privacy_policy", "terms_conditions", "faq"].includes(type)) {
        throw new AppError("Tipo non valido", 400);
    }
    // Validate id
    if (!id) {
        throw new AppError("Id non valido", 400);
    }
    if (!title || !content) {   
        throw new AppError("Titolo o contenuto non valido", 400);
    }
    const page = await updateAdditionalByIdService(type, id, title, content);
    res.json({ message: "Informazioni aggiornate con successo", page });
});

const getAdditionalById = catchAsync(async (req: Request, res: Response) => {
    const { type, id } = req.params;
    // Validate type
    if (!["privacy_policy", "terms_conditions", "faq"].includes(type)) {
        throw new AppError("Tipo non valido", 400);
    }
    // Validate id
    if (!id) {
        throw new AppError("Id non valido", 400);
    }
    const page = await getAdditionalByIdService(type, id);
    res.json({ message: "Informazioni recuperate con successo", page });
});


const deleteAdditionalById = catchAsync(async (req: Request, res: Response) => {
    const { type, id } = req.params;
    // Validate type
    if (!["privacy_policy", "terms_conditions", "faq"].includes(type)) {
        throw new AppError("Tipo non valido", 400);
    }
    // Validate id
    if (!id) {
        throw new AppError("Id non valido", 400);
    }
    await deleteAdditionalByIdService(type, id);
    res.json({ message: "Informazioni eliminate con successo"});
});
      

export { getAdditionalByType,createAdditionalByType,deleteAdditionalByType,updateAdditionalById,getAdditionalById, deleteAdditionalById };