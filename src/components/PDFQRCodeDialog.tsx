import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
  } from "@/components/ui/dialog";
  import { useEffect, useState } from "react";
  import QRCode from 'qrcode';
  import { Smartphone } from "lucide-react";
  
  interface PDFQRCodeDialogProps {
    pdfDataUri: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }
  
  export const PDFQRCodeDialog = ({ pdfDataUri, open, onOpenChange }: PDFQRCodeDialogProps) => {
    const [qrCodeImage, setQrCodeImage] = useState('');
  
    useEffect(() => {
      if (pdfDataUri) {
        QRCode.toDataURL(pdfDataUri, { width: 400 })
          .then(url => {
            setQrCodeImage(url);
          })
          .catch(err => {
            console.error("Failed to generate QR Code for PDF", err);
          });
      }
    }, [pdfDataUri]);
  
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">Seu Orçamento está Pronto!</DialogTitle>
            <DialogDescription className="text-center text-base">
              Aponte a câmera do seu celular para o QR Code abaixo para baixar o PDF do seu orçamento.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-4">
            {qrCodeImage ? (
              <img src={qrCodeImage} alt="QR Code para baixar o PDF do orçamento" className="rounded-lg border-4 border-primary" />
            ) : (
              <div className="w-64 h-64 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
                Carregando QR Code...
              </div>
            )}
          </div>
          <div className="flex items-center justify-center text-muted-foreground mt-4">
              <Smartphone className="h-5 w-5 mr-2" />
              <span>Abra a câmera do seu celular e aponte para a imagem.</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  };