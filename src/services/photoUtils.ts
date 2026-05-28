/** Converte referência de foto (URL ou base64) para base64 utilizável no PDF */
export const photoRefToBase64 = async (photoRef: string): Promise<string | null> => {
  if (!photoRef) return null;
  if (photoRef.startsWith('data:')) return photoRef;

  if (photoRef.startsWith('http://') || photoRef.startsWith('https://')) {
    try {
      const response = await fetch(photoRef);
      const blob = await response.blob();
      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Erro ao carregar foto da URL:', error);
      return null;
    }
  }

  return null;
};

export const isRemotePhotoRef = (photoRef: string): boolean =>
  photoRef.startsWith('http://') || photoRef.startsWith('https://');

export const isInlinePhotoRef = (photoRef: string): boolean =>
  photoRef.startsWith('data:');
