"use client"

import { useState } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import SignInDialog from "./sign-in-dialog";

const SignInDialogClientWrapper = () => {
    const [signInDialogIsOpen, setSignInDialogIsOpen] = useState(true); // Inicialmente, o diálogo estará aberto

    return (
        <Dialog open={signInDialogIsOpen} onOpenChange={(open) => setSignInDialogIsOpen(open)}>
            <DialogContent className="w-[90%]">
                <SignInDialog />
            </DialogContent>
        </Dialog>
    );
}
 
export default SignInDialogClientWrapper;