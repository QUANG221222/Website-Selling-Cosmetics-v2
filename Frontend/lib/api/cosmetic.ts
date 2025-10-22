import { ApiResponse, Cosmetic } from "@/lib/types/index";
import axiosInstance from "@/lib/api/axios";
import { toast } from "sonner";

export interface CreateCosmeticData {
  nameCosmetic: string
  brand: string
  classify: string
  quantity: number
  description: string
  originalPrice: number
  discountPrice: number
  rating?: number
  isNew?: boolean
  isSaleOff?: boolean
}

export interface UpdateCosmeticData extends Partial<CreateCosmeticData> {}

export const cosmeticApi = {
    // Get all cosmetic
    getAll: async (): Promise<ApiResponse<Cosmetic[]>> => {
        try {
            const response = await axiosInstance.get("/cosmetics")
            return response.data
        } catch (error : any) {
            throw error
        }
    },
    // Get cosmetic by ID
    getById: async (id: string): Promise<ApiResponse<Cosmetic>> => {
        try {
            const response = await axiosInstance.get(`/cosmetics/id/${id}`)
            return response.data
        } catch (error: any) {
            throw error
        }
    },
    //Get cosmetic by slug
    getBySlug: async (slug: string): Promise<ApiResponse<Cosmetic>> => {
        try {
            const response = await axiosInstance.get(`cosmetics/slug/${slug}`)
            return response.data
        } catch (error) {
            throw error
        }
    },

    // Create new Cosmetic
    create: async (data : CreateCosmeticData, imageFile: File) : Promise<ApiResponse<Cosmetic>> => {
        try {
            const formData = new FormData();

            //Append all cosmetic data
            Object.entries(data).forEach(([key, value]) =>{
                if (value !== undefined && value !== null ) {
                    formData.append(key, value.toString());
                }
            })
            // Append image file
            formData.append('image', imageFile)

            const response = await axiosInstance.post('/cosmetics', formData, {
                headers: {
                'Content-Type': 'multipart/form-data'
                }
            })
                toast.success('Cosmetic created successfully!')
                return response.data
        } catch (error: any) {
            toast.error('Failed to create cosmetic')
            throw error
        }

    },
     // Update cosmetic (with optional new image)
  update: async (
    id: string, 
    data: UpdateCosmeticData, 
    imageFile?: File
  ): Promise<ApiResponse<Cosmetic>> => {
    try {
      const formData = new FormData()
      
      // Append updated data
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString())
        }
      })
      
      // Append new image if provided
      if (imageFile) {
        formData.append('image', imageFile)
      }

      const response = await axiosInstance.put(`/cosmetics/id/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      toast.success('Cosmetic updated successfully!')
      return response.data
    } catch (error: any) {
      toast.error('Failed to update cosmetic')
      throw error
    }
  },
     // Delete cosmetic
  delete: async (id: string): Promise<ApiResponse> => {
    try {
      const response = await axiosInstance.delete(`/cosmetics/id/${id}`)
      toast.success('Cosmetic deleted successfully!')
      return response.data
    } catch (error: any) {
      toast.error('Failed to delete cosmetic')
      throw error
    }
  },

  // Upload single image (standalone)
  uploadSingleImage: async (imageFile: File): Promise<ApiResponse<{
    url: string
    publicId: string
    originalName: string
    size: number
    format: string
  }>> => {
    try {
      const formData = new FormData()
      formData.append('image', imageFile)

      const response = await axiosInstance.post('/cosmetics/single', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      toast.success('Image uploaded successfully!')
      return response.data
    } catch (error: any) {
      toast.error('Failed to upload image')
      throw error
    }
  },

  // Upload multiple images (standalone)
  uploadMultipleImages: async (imageFiles: File[]): Promise<ApiResponse<Array<{
    url: string
    publicId: string
    originalName: string
    size: number
    format: string
  }>>> => {
    try {
      const formData = new FormData()
      imageFiles.forEach(file => {
        formData.append('images', file)
      })

      const response = await axiosInstance.post('/cosmetics/multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      toast.success(`${imageFiles.length} images uploaded successfully!`)
      return response.data
    } catch (error: any) {
      toast.error('Failed to upload images')
      throw error
    }
  }
}