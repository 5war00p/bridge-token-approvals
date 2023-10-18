<script lang="ts">
	import { wakuNodeStatus } from '$lib/store';

	const getColor = () => {
		switch ($wakuNodeStatus) {
			case 'connecting':
				return 'fill-yellow-400';
			case 'connected':
				return 'fill-green-400';
			case 'failed':
				return 'fill-red-400';
			case 'disconnected':
				return 'fill-gray-400';
			default:
				return 'fill-gray-400';
		}
	};
</script>

<span
	class="inline-flex items-center gap-x-1.5 rounded-full px-4 text-xs font-medium border-2 border-gray-100 text-gray-600"
>
	<svg class={`h-1.5 w-1.5 ${getColor()}`} viewBox="0 0 6 6" aria-hidden="true">
		<circle cx="3" cy="3" r="3" />
	</svg>
	Peer Connection
</span>
