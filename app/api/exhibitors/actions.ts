"use server"

import { getAllExhibitors, getExhibitorById } from "@/lib/db";


export async function getAllExhibitor(){
  try{
    const exhibitors = await getAllExhibitors()
    return { success: true, data: exhibitors}
  }catch (error){
    return { success: false, error: error }
  }
}

export async function getExhibitorId(id: string){
  try {
    const response = await getExhibitorById(id)
    return {success: true, data: response}
  }catch (error){
    return {success: false, error: error}
  }
}