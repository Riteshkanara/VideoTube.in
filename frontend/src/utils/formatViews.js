export const formatViews = (views) => {

    const count =  views || 0;
    return count.toString();

    if(views >= 1000000){
        return `${(views / 1000000).toFixed(1)}M`;
    }
    if(views >= 1000){
        return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();


}