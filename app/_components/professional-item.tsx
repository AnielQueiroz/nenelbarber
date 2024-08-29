"use client"

import { Professional } from "@prisma/client";
import { Button } from "./ui/button";
import { useState } from "react";

interface ProfessionalProps {
    professional: Professional
}

const ProfessionalItem = ({ professional }: ProfessionalProps) => {
    const [selectedProfessional, setSelectedProfessional] = useState<string | undefined>(undefined);

    const handleSelectProfessional = (professionalId: string) => {
        if (selectedProfessional === professionalId) {
            setSelectedProfessional(undefined);
            return;
        }

        setSelectedProfessional(professionalId);
    };

    return (
        <Button 
            key={professional.id} 
            variant={selectedProfessional === professional.id ? "default" : "outline"}
            className="rounded-full" 
            onClick={() => handleSelectProfessional(professional.id)}
        >
            {professional.name}
        </Button>
    );
}
 
export default ProfessionalItem;