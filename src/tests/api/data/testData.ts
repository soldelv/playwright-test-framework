const randomId = Math.floor(100000 + Math.random() * 900000)

export const newPetRequest = {
    id: randomId,
    category: {
        id: 12345,
        name: 'Fluffy',
    },
    name: 'doggie',
    photoUrls: [
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQg5rK3pm3iLKAth3m5OzJEMxkTmMUzhTqK_Q&s',
    ],
    status: 'available',
}