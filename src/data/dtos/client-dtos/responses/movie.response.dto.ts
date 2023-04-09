export class BestMovieDto {
	constructor(
		public categoryName: string,
		public id: string,
		public movieName: string,
		public description: string,
		public rate: number,
		public movieImages: string[]
	) {}
}

export class MovieActorDto {
	constructor(
		public actorId: string,
		public actorName: string,
		public actorImagePath: string
	) {}
}

export class MovieCommentDto {
	constructor(
		public userId: string,
		public userName: string,
		public userImagePath: string,
		public comment: string
	) {}
}

export class MovieDetails {
	constructor(
		public id: string,
		public avgRatingEntertament: number,
		public ratingResolution: number,
		public ratingPerformActors: number,
		public countComments: number,
		public countLike: number,
		public countDislike: number,
		public countRatings: number
	) {}
}

export class MovieDescription {
	constructor(
		public id: string,
		public name: string,
		public description: string,
		public rate: number,
		public moviePath: string,
		public poster: string,
		public trailer: string,
		public banner: string,
		public releaseDate: Date
	) {}
}
