"use client"

import Link from "next/link";
import { HomeIcon, CalendarIcon, LogOut, LogInIcon } from "lucide-react";
// import { quickSearchOptions } from "../_constants/search";
import { Button } from "./ui/button";
import { SheetClose, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
// import Image from "next/image";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { signOut, useSession } from "next-auth/react";
import SignInDialog from "./sign-in-dialog";

const SidebarSheet = () => {
    const {data} = useSession()
    
    const handleLogoutClick = () => signOut()
    
    return (
        <SheetContent className="overflow-y-auto">
            <SheetHeader>
                <SheetTitle className="text-left">Menu</SheetTitle>
            </SheetHeader>

            <div className="flex items-center justify-between py-5 border-b border-solid gap-3">
                {data?.user ? (
                    <div className="flex items-center gap-2">
                        <Avatar>
                            <AvatarImage src={data?.user?.image ?? ""} alt="Foto de perfil"/>
                        </Avatar>

                        <div>
                            <p className="font-bold">{data?.user?.name}</p>
                            <p className="text-xs">{data?.user?.email}</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <h2 className="font-bold">Olá, faça seu login!</h2>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button size="icon">
                                    <LogInIcon size={18}/>
                                </Button>
                            </DialogTrigger>
                            
                            <DialogContent className="w-[90%]">
                                <SignInDialog />
                            </DialogContent>
                        </Dialog>    
                    </>
                )}
            </div>

            <div className="py-4 flex flex-col gap-2 border-b border-solid">
                <SheetClose asChild>
                    <Button variant="ghost" className="justify-start gap-2" asChild>
                        <Link href="/">
                            <HomeIcon size={18}/>
                            Início
                        </Link>
                    </Button>
                </SheetClose>
                <Button variant="ghost" className="justify-start gap-2" asChild>
                    <Link href="/bookings">
                        <CalendarIcon size={18}/> 
                        Agendamentos
                    </Link>
                </Button>
            </div>
            
            {/* <div className="py-4 flex flex-col gap-2 border-b border-solid">
                {quickSearchOptions.map((option) => (
                    <SheetClose key={option.title} asChild>
                        <Button variant="ghost" className="justify-start gap-2" asChild>
                            <Link href={`/barbershops?service=${option.title}`}>
                                <Image src={option.imageUrl} width={18} height={18} alt={option.title} />
                                {option.title}
                            </Link>
                        </Button>
                    </SheetClose>
                ))}
            </div> */}

            {data?.user && (
                <div className="py-4 flex flex-col gap-2">
                    <Button variant="ghost" className="justify-start gap-2" onClick={handleLogoutClick}>
                        <LogOut size={18}/>
                        Sair
                    </Button>
                </div>
            )}
        </SheetContent>        
    );
}
 
export default SidebarSheet;