import { Eye, Download, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGetVendorDocuments } from '../../hooks/useQueries';
import type { Vendor } from '../../backend';
import { Principal } from '@dfinity/principal';

interface VendorDocumentsDialogProps {
  vendor: Vendor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function VendorDocumentsDialog({ vendor, open, onOpenChange }: VendorDocumentsDialogProps) {
  const { data: documents = [], isLoading: documentsLoading } = useGetVendorDocuments(
    vendor?.principal || Principal.anonymous()
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Vendor Documents - {vendor?.name || 'Unknown Vendor'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {documentsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin text-4xl mb-2">⏳</div>
              <p className="text-muted-foreground">Loading documents...</p>
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground">No documents uploaded yet</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {documents.map((doc, index) => {
                const docUrl = doc.getDirectURL();
                return (
                  <Card key={index} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="h-8 w-8 text-primary" />
                          <div>
                            <p className="font-medium">Document {index + 1}</p>
                            <p className="text-xs text-muted-foreground">Vendor submission</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(docUrl, '_blank')}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = docUrl;
                              link.download = `vendor-document-${index + 1}`;
                              link.click();
                            }}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
