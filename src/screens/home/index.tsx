import { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { DrawerAppBar, SentenceSelector, Button } from '~/components/ui';

import { Alertify, analyzeSentences, logAction } from '~/services';

export default function Home() {
  const text =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi orci felis, pulvinar in metus id, imperdiet auctor mi. Pellentesque condimentum aliquam pretium. Sed commodo finibus quam auctor dictum. Duis vulputate nulla at tellus vehicula malesuada. Phasellus et quam massa. Morbi et lorem ut turpis fermentum ultrices. Pellentesque pretium aliquam lorem, interdum rutrum sapien venenatis et. Integer eget est at dui egestas condimentum. Donec a erat quis ante aliquet porttitor. Nullam mi tellus, vestibulum eu accumsan sit amet, ultricies molestie enim. Fusce sed massa at ipsum consectetur finibus. Mauris consequat, justo id pharetra congue, neque nisl pharetra felis, nec tempor odio neque et sem. Praesent pretium pulvinar eleifend. Nullam placerat hendrerit neque, eget scelerisque massa tempor sodales. Sed vitae ipsum sagittis, vulputate mauris sit amet, pulvinar eros. Phasellus et libero urna. Nam molestie orci quis maximus ullamcorper. Fusce eget laoreet velit, et viverra elit. Nam ut mattis odio. Aliquam erat volutpat. Fusce venenatis ligula ac lorem facilisis ornare. Donec tincidunt dolor ut neque eleifend viverra. Maecenas massa leo, finibus ac magna pharetra, ornare sodales sapien. Interdum et malesuada fames ac ante ipsum primis in faucibus. Fusce in odio ut neque placerat ullamcorper. Aenean in auctor erat, at ornare nibh. Etiam nulla est, bibendum quis justo et, ullamcorper luctus mauris. Integer luctus quis odio sed eleifend. Pellentesque ut faucibus purus, in semper eros. Praesent sit amet hendrerit justo. Nulla luctus porttitor eleifend. Nunc dictum at ante vitae mattis. Aliquam ut erat sit amet mi laoreet fermentum in ut nulla. Fusce sit amet imperdiet est. Pellentesque dolor nibh, rutrum eget tempus et, vulputate at magna. Ut magna magna, commodo a iaculis a, congue eget magna. Pellentesque euismod porta porttitor. Vivamus placerat, nulla eu rhoncus sodales, justo massa iaculis orci, vitae mollis tortor nibh eu nisl. Nunc accumsan ullamcorper est. Ut tristique est eu arcu commodo, et rutrum mi aliquam. Sed blandit pulvinar orci sed porta. Donec tincidunt vel sem eget porta. Nullam egestas mollis aliquet. Cras at mollis erat. Nam aliquet sapien quam, id lacinia diam varius iaculis. Morbi ac dolor lacus. Donec finibus orci vel leo porttitor mollis. Fusce porttitor metus vel odio vehicula, vitae volutpat velit viverra. Aenean ut faucibus nisl, a viverra dolor. Phasellus turpis est, scelerisque sed tortor id, finibus euismod diam. Morbi fermentum orci ac nisi rutrum tincidunt. Donec porttitor ornare quam, viverra maximus quam laoreet at. Nullam leo leo, egestas ut gravida at, consectetur quis sem. Donec sodales risus id tincidunt tempor. Suspendisse gravida ligula a purus luctus condimentum. Aenean bibendum suscipit massa facilisis pretium. Nunc ut elit gravida, aliquam est at, dictum enim. Donec nec sagittis tellus, vel accumsan ex. Mauris nec hendrerit libero. Praesent varius porta ligula, vitae malesuada nunc congue nec.';

  const SUMMARY_STORAGE_KEY = 'generated-summary';

  const [selectedSentences, setSelectedSentences] = useState<
    SelectedSentence[]
  >([]);

  const [summary, setSummary] = useState<string>(() => {
    return localStorage.getItem(SUMMARY_STORAGE_KEY) ?? '';
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    localStorage.setItem(SUMMARY_STORAGE_KEY, summary);
  }, [summary]);

  const handleAnalyze = async () => {
    if (isAnalyzing) {
      return;
    }

    if (selectedSentences.length === 0) {
      Alertify.info('Please select at least one sentence.');
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await analyzeSentences(selectedSentences);

      setSummary(response.result.received_args);

      logAction('summary_generated', {
        sentence_count: selectedSentences.length,
      });
    } catch (error) {
      console.error('Analysis failed:', error);

      Alertify.error('Failed to generate summary.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <DrawerAppBar />

      <Box
        sx={{
          display: 'grid',

          // Left content | button space | right content
          gridTemplateColumns: 'minmax(0, 1fr) 20px minmax(0, 1fr)',

          columnGap: 3,
          alignItems: 'start',
          p: 4,
        }}
      >
        {/* Sentence selection */}
        <Box sx={{ minWidth: 0 }}>
          <SentenceSelector
            text={text}
            onSelectionChange={setSelectedSentences}
          />
        </Box>

        {/* Reserved middle column */}
        <Box
          sx={{
            width: 80,
          }}
        />

        {/* Summary */}
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h5">Summary</Typography>

          <Box
            sx={{
              border: 1,
              borderColor: 'divider',
              p: 2,
              minHeight: 300,
              mt: 1,
              borderRadius: 1,
              bgcolor: 'background.paper',
            }}
          >
            <Typography
              color={summary ? 'text.primary' : 'text.secondary'}
              sx={{
                whiteSpace: 'pre-wrap',
              }}
            >
              {summary || 'Your summary will appear here...'}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Generate summary button */}
      <Box
        sx={{
          position: 'fixed',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: (theme) => theme.zIndex.appBar + 1,
        }}
      >
        <Button
          logId="generate_summary"
          variant="default"
          size="icon"
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          aria-label={isAnalyzing ? 'Generating summary' : 'Generate summary'}
          className="h-20 w-12 rounded-full"
        >
          {isAnalyzing ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            <ArrowForwardIcon />
          )}
        </Button>
      </Box>
    </>
  );
}
