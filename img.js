export default function img(file){
    const image = new Image();
    image.src = 'sprites/' +file;
    return image;
}