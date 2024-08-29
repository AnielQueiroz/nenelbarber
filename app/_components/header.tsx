import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { MenuIcon } from "lucide-react";
import { Sheet, SheetTrigger } from "./ui/sheet";

import SidebarSheet from "./sidebar-sheet";
import Link from "next/link";

const Header = () => {
    return ( 
        <Card>
            <CardContent className="p-5 flex flex-row justify-between items-center">
                <Link href="/">                
                    <Image src={"/logo.png"} width={120} height={18} alt="Nenel Barber"/>
                </Link>
                
                <Sheet>
                    <SheetTrigger asChild>
                        <Button size="icon" variant="outline">
                            <MenuIcon />
                        </Button>
                    </SheetTrigger>
                    
                    <SidebarSheet />
                </Sheet>
            </CardContent>
        </Card>
     );
}
 
export default Header;