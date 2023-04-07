export class CategoryDto {
	constructor(
		public id: string,
		public name: string,
		public imagePath: string
	) {}
}

export class MovieByCategoryDto {
	constructor(
		public categoryName: string,
		public id: string,
		public movieName: string,
		public description: string,
		public rate: number,
		public imagePath: string
	) {}
}
