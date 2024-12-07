import { faker } from "@faker-js/faker"
import type { TvMovie } from "@/interfaces/Entity"


export async function getImageList(page: number = 0, offset: number = 20): Promise<TvMovie[]> {
    const data: any = Array.from({length: offset}, (_, key) => {
        return {
            key: key + page + offset,
            name: faker.internet.displayName(),
            text: faker.lorem.paragraph(1),
            image: faker.image.urlLoremFlickr({
                category: 'nature',
                width: 640,
                height: 480
            })
        }
    })
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(data)
        }, 1000)
    })
}