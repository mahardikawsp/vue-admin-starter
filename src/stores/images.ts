import { http, useHttpFile } from "@/app/http";
import { defineStore } from "pinia";

interface image {
	imageUrl: string;
}

const initialState: image = {
	imageUrl: "",
};

export const useImageStore = defineStore("image", {
	state: () => ({
		...initialState,
	}),
	getters: {
		loadImage: (state) => {
			return state.imageUrl;
		},
	},
	actions: {
		async setImage(path: string, filename: string) {
			try {
				const image = await useHttpFile(`${path}/${filename}`);
				const imageBlob = image.data; // Get the blob data
				const imageUrl = URL.createObjectURL(imageBlob); // Create a blob URL
				this.imageUrl = imageUrl; // Store the blob URL
				return imageUrl;
			} catch (error) {
				return error;
			}
		},
	},
});
