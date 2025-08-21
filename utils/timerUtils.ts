export const formatTiempo = (milis: number): string => {
    const h = Math.floor(milis / 3600000).toString().padStart(2, '0');
    const m = Math.floor((milis % 3600000) / 60000).toString().padStart(2, '0');
    const s = Math.floor((milis % 60000) / 1000).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };
  
  export const validateTimeFormat = (time: string): boolean => {
    // Validate formats: MM:SS or HH:MM:SS
    const timeRegex = /^([0-9]{1,2}:)?[0-5][0-9]:[0-5][0-9]$/;
    
    if (!timeRegex.test(time)) {
      return false;
    }
  
    // Additional validation for hours if present
    const parts = time.split(':');
    if (parts.length === 3) {
      const hours = parseInt(parts[0]);
      if (hours > 23) {
        return false;
      }
    }
  
    return true;
  };
  
  export const parseTimeToMilliseconds = (timeString: string): number => {
    const parts = timeString.split(':').map(part => parseInt(part) || 0);
    
    if (parts.length === 2) {
      // MM:SS format
      return (parts[0] * 60000) + (parts[1] * 1000);
    } else if (parts.length === 3) {
      // HH:MM:SS format
      return (parts[0] * 3600000) + (parts[1] * 60000) + (parts[2] * 1000);
    }
    return 0;
  };
  
  export const formatCustomTimeInput = (text: string): string => {
    // Remove all non-numeric characters
    const numbers = text.replace(/[^0-9]/g, '');
    
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)}:${numbers.slice(2)}`;
    } else {
      return `${numbers.slice(0, 2)}:${numbers.slice(2, 4)}:${numbers.slice(4, 6)}`;
    }
  };