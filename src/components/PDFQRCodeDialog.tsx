import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import QRCode from 'qrcode';
import { Smartphone, UploadCloud } from "lucide-react";

interface PDFQRCodeDialogProps {
  publicUrl: string | null;
  isLoading: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PDFQRCodeDialog = ({ publicUrl, isLoading, open, onOpenChange }: PDFQRCodeDialogProps) => {
  const [qrCodeImage, setQrCodeImage] = useState('');

  useEffect(() => {
    if (publicUrl && open) {
      QRCode.toDataURL(publicUrl, { width: 400, margin: 1 })
        .then(imageUrl => {
          setQrCodeImage(imageUrl);
        })
        .catch(err => {
          console.error("Failed to generate QR Code from public URL", err);
        });
    }
  }, [publicUrl, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Seu Orçamento está Pronto!</DialogTitle>
          <DialogDescription className="text-center text-base">
            Aponte a câmera do seu celular para o QR Code abaixo para baixar o PDF.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-4">
          {isLoading ? (
            <div className="w-64 h-64 flex flex-col items-center justify-center text-muted-foreground">
              <UploadCloud className="h-16 w-16 mb-4 animate-pulse" />
              <span>Gerando link seguro...</span>
            </div>
          ) : qrCodeImage ? (
            <img src={qrCodeImage} alt="QR Code para baixar o PDF do orçamento" className="rounded-lg border-4 border-primary" />
          ) : (
            <div className="w-64 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              Erro ao gerar QR Code.
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