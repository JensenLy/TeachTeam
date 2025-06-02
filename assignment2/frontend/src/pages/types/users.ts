import { ApplicationData } from "./applicationData"
export type Users = {
firstName: string
lastName: string
email: string
password: string
userRole: string
chosenCandidate?: ApplicationData[]
    }