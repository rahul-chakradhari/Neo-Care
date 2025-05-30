import React from "react";
interface Buttonprops {
    isLoading : boolean,
    className? : string,
    children : React.ReactNode,
}
import {Button} from "@/components/ui/button"
import Image from "next/image"
const SubmitButton = ({ isLoading, className, children }: Buttonprops) => {
    return(
        <Button type="submit" disabled={isLoading} className={className ?? 'shad-primary-btn w-full'}>
            {isLoading ? (
                <div className="flex items-center gap-4">
                    <Image
                    src= "/assets/icons/loader.svg"
                    alt="loader"
                    width={24}
                    height ={24}
                    className ="animate-spin"
                     />

                </div>
            ): children}
        </Button>
    );
}

export default SubmitButton