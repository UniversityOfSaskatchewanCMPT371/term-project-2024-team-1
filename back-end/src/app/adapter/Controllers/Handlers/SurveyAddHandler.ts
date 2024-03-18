import { Request, Response } from "express";
import { ISurveyRepository } from "@app/domain/interfaces/repositories/ISurveyRepository";
import { Survey } from "@app/domain/Survey";
import { inject, injectable } from "tsyringe";

@injectable()
export class SurveyAddHandler {
    constructor(@inject("ISurveyRepository") private surveyRepo: ISurveyRepository) {}

    async handle(req: Request, res: Response): Promise<void> {
        try {
            if (!req.body.surveyName || typeof req.body.surveyName !== 'string') {
                res.status(400).send("Invalid survey data");
                return;
            }

            const survey = new Survey(req.body.surveyName, new Date());
            const success = await this.surveyRepo.createSurvey(survey);

            if (success) {
                res.status(200).json({ message: "Survey added successfully." });
            } else {
                res.status(500).send("Failed to create survey");
            }
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal server error");
        }
    }
}