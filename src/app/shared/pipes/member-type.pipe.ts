import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'memberType',
    standalone: true
})

export class MemberTypePipe implements PipeTransform {
    transform(value: string): string {
        if (!value) return 'Unknown';

        switch (value){
            case 'regular':
                return 'Regular';
            case 'vip':
                return 'Vip';
            case 'blacklist':
                return 'Blacklist';
            default:
                return value;
        }
    }
}